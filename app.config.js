const IS_DEV = process.env.EAS_BUILD_PROFILE === 'development';

export default {
  expo: {
    name: IS_DEV ? "СімБюджет (Dev)" : "СімБюджет",
    slug: "budget-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "budget-app",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    updates: {
      url: "https://u.expo.dev/b9d31e56-5bcd-4454-a1ec-c4f23749b423"
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      package: IS_DEV ? "com.simbudget.budgetapp.dev" : "com.simbudget.budgetapp",
      versionCode: 1,
      version: "1.0.0",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./src/assets/images/icon.png",
        backgroundColor: "#ffffff"
      },
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./src/assets/images/logo.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#121212",
          "dark": {
            "backgroundColor": "#121212"
          }
        }
      ],
      "expo-font",
      "expo-image",
      "expo-web-browser",
      "expo-sharing",
      "@react-native-google-signin/google-signin",
      "@react-native-community/datetimepicker",
      "./plugins/withJvmArgs",
      [
        "expo-notifications",
        {
          icon: "./src/assets/images/notification-icon.png",
          color: "#1B5E20"
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "b9d31e56-5bcd-4454-a1ec-c4f23749b423"
      }
    }
  }
};