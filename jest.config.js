export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    reporters : getReporters(),
    ...getCoverageConfig()
};

function getReporters() {
    const result = ['default'];

    if(process.env.QA_TESTRUN_DIR) {
        result.push(tapReporter());
    }

    return result;

    function tapReporter() {
        return [
            'jest-tap-reporter',
            {
                filePath: `${process.env.QA_TESTRUN_DIR}/testresults.tap`
            }
        ]
    }
}

function getCoverageConfig() {
    const result = {};

    if(process.env.QA_TESTRUN_DIR) {
        result.coverageReporters = ['lcovonly']; // just generate the raw data not the report
        result.coverageDirectory = `${process.env.QA_TESTRUN_DIR}`;
    }
    return result;
}
