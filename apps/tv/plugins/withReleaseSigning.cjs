const { withAppBuildGradle } = require('@expo/config-plugins');

const releaseSigningBlock = `
    signingConfigs {
        release {
            def releaseStoreFile = System.getenv("VIUWU_RELEASE_STORE_FILE")
            if (releaseStoreFile) {
                storeFile file(releaseStoreFile)
                storePassword System.getenv("VIUWU_RELEASE_STORE_PASSWORD")
                keyAlias System.getenv("VIUWU_RELEASE_KEY_ALIAS")
                keyPassword System.getenv("VIUWU_RELEASE_KEY_PASSWORD")
            }
        }
    }
`;

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (gradleConfig) => {
    if (gradleConfig.modResults.language !== 'groovy') {
      throw new Error('Viuwu release signing currently requires a Groovy Android build file.');
    }

    let contents = gradleConfig.modResults.contents;

    if (!contents.includes('def releaseStoreFile = System.getenv("VIUWU_RELEASE_STORE_FILE")')) {
      contents = contents.replace('    buildTypes {', `${releaseSigningBlock}\n    buildTypes {`);
    }

    contents = contents.replace(
      /release \{\s+\/\/ Caution![\s\S]*?signingConfig signingConfigs\.debug/,
      (releaseBlock) =>
        releaseBlock.replace(
          'signingConfig signingConfigs.debug',
          'signingConfig signingConfigs.release',
        ),
    );

    gradleConfig.modResults.contents = contents;
    return gradleConfig;
  });
};
