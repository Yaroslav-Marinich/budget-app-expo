const { withGradleProperties } = require('@expo/config-plugins');

const withJvmArgs = (config) => {
    return withGradleProperties(config, (config) => {
        const jvmArgsIndex = config.modResults.findIndex(
            (item) => item.type === 'property' && item.key === 'org.gradle.jvmargs'
        );
        const customJvmArgs = '-Xmx4g -XX:MaxMetaspaceSize=1g -XX:+HeapDumpOnOutOfMemoryError';

        if (jvmArgsIndex > -1) {
            config.modResults[jvmArgsIndex].value = customJvmArgs;
        } else {
            config.modResults.push({
                type: 'property',
                key: 'org.gradle.jvmargs',
                value: customJvmArgs,
            });
        }
        return config;
    });
};

module.exports = withJvmArgs;