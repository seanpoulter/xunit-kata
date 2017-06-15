import {TestCase, TestResult, TestSuite, assert} from '../src';

class WasRun extends TestCase {
    log: string;

    constructor(name: PropertyKey) {
        super(name)
        this.log = '';
    }

    setUp() {
        this.log = 'setUp ';
    }

    testMethod() {
        this.log += 'testMethod ';
    }

    testBrokenMethod() {
        throw new Error();
    }

    tearDown() {
        this.log += 'tearDown';
    }
}

class TestCaseTest extends TestCase {
    test: WasRun;
    result: TestResult;

    setUp() {
        this.result = new TestResult();
    }

    testTemplateMethod() {
        this.test = new WasRun('testMethod');
        assert.equals('', this.test.log);
        this.test.run(this.result);
        assert.equals('setUp testMethod tearDown', this.test.log);
    }

    testResult() {
        this.test = new WasRun('testMethod');
        this.result = this.test.run(this.result);
        assert.equals('1 run, 0 failed', this.result.summary());
    }

    testFailedResult() {
        this.test = new WasRun('testBrokenMethod');
        this.result = this.test.run(this.result);
        assert.equals('1 run, 1 failed', this.result.summary());
    }

    testFailedResultFormatting() {
        this.result.testStarted();
        this.result.testFailed();
        assert.equals('1 run, 1 failed', this.result.summary());
    }

    testSuite() {
        let suite = new TestSuite();
        suite.add(
            new WasRun('testMethod'),
            new WasRun('testBrokenMethod')
        );

        this.result = new TestResult();
        suite.run(this.result);
        assert.equals('2 run, 1 failed', this.result.summary());
    }

    testFailedSetUp() {
        this.test = new WasRun('testMethod');
        this.test.setUp = function failedSetUp() {
            this.log = 'setUp ';
            throw new Error();
        }
        this.result = this.test.run(this.result);
        assert.equals('setUp tearDown', this.test.log);
    }

    testTearDownAlwaysRuns() {
        this.test = new WasRun('testBrokenMethod');
        this.test.run(this.result);
        assert.equals('setUp tearDown', this.test.log);
    }

    testCountTestCases() {
        let sut = new WasRun('testMethod');
        assert.equals(2, sut.countTestCases());
    }
}

let suite = new TestSuite();
suite.add(
    new TestCaseTest('testTemplateMethod'),
    new TestCaseTest('testResult'),
    new TestCaseTest('testFailedResult'),
    new TestCaseTest('testFailedResultFormatting'),
    new TestCaseTest('testSuite'),
    new TestCaseTest('testFailedSetUp'),
    new TestCaseTest('testTearDownAlwaysRuns'),
    new TestCaseTest('testCountTestCases')
);
let result = new TestResult();
suite.run(result);
console.log(result.summary());
