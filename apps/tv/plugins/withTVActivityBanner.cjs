const { AndroidConfig, withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withTVActivityBanner(config) {
  return withAndroidManifest(config, (manifestConfig) => {
    const mainActivity = AndroidConfig.Manifest.getMainActivityOrThrow(manifestConfig.modResults);
    mainActivity.$['android:banner'] = '@drawable/tv_banner';
    return manifestConfig;
  });
};
