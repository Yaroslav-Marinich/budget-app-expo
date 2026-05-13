const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Плагін для виправлення синтаксису Groovy DSL у build.gradle
 */
const withAndroidGradleFix = (config) => {
    return withAppBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            let content = config.modResults.contents;

            // 1. Виправляємо ndkVersion, buildToolsVersion, compileSdk
            content = content.replace(/ndkVersion\s+rootProject/g, 'ndkVersion = rootProject');
            content = content.replace(/buildToolsVersion\s+rootProject/g, 'buildToolsVersion = rootProject');
            content = content.replace(/compileSdk\s+rootProject/g, 'compileSdk = rootProject');

            // 2. Виправляємо shrinkResources та crunchPngs
            content = content.replace(/shrinkResources\s+enableShrinkResources/g, 'shrinkResources = enableShrinkResources');
            content = content.replace(/crunchPngs\s+enablePngCrunchInRelease/g, 'crunchPngs = enablePngCrunchInRelease');

            // 3. Виправляємо signingConfig (найчастіша помилка)
            // Замінюємо "signingConfig signingConfigs.debug" на "signingConfig = signingConfigs.debug"
            content = content.replace(/signingConfig\s+signingConfigs\.(debug|release)/g, 'signingConfig = signingConfigs.$1');

            config.modResults.contents = content;
        }
        return config;
    });
};

module.exports = withAndroidGradleFix;