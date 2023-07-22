export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    reporters : getReporters(),
};

function getReporters() {
    const result = ['default'];

    if(process.env.QA_TESTRUN) {
        result.push(tapReporter());
    }

    return result;

    function tapReporter() {
        return [
            'jest-tap-reporter',
            {
                filePath: `${process.env.QA_TESTRUN}.tap`
            }
        ]
    }
}
