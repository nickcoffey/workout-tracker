# iOS Development Lane

This app targets Expo SDK 56. If Expo Go on a physical iPhone only supports an older SDK, use a development build instead of downgrading the app.

## Simulator Workflow

The simulator lane does not require an Apple Developer Program subscription.

1. Build a simulator development client:

   ```sh
   npx eas-cli build -p ios --profile development-simulator
   ```

2. Install the completed build when EAS prompts you, or install a previous simulator build:

   ```sh
   npx eas-cli build:run -p ios
   ```

3. Start Metro for the development client:

   ```sh
   npm run start:dev-client
   ```

Expo documents simulator builds as standalone apps that run independently of Expo Go and do not require TestFlight or an Apple Developer account. The build profile for this project lives in `eas.json` as `development-simulator`.

## How This Differs From Expo Go

Expo Go is a fixed native app from the App Store. It can only run JavaScript against native modules and SDK support already included in that installed Expo Go version.

A development build is this app's own native shell. After it is installed in the simulator, JavaScript still reloads from Metro during development, but native dependencies and native config come from the app-specific build. Rebuild the development client when native dependencies or native configuration change.

## Local iPhone Investigation Path

Before paying for Apple Developer Program enrollment, the no-paid physical-device path to try is local compilation from macOS:

```sh
npm run ios:device
```

That script runs:

```sh
npx expo run:ios --device
```

Expected prerequisites:
- Xcode installed and configured.
- The iPhone connected to the Mac and trusted.
- Developer Mode enabled on the iPhone.
- A free Apple ID available in Xcode for personal-team signing.

Expected caveats:
- Local signing can be fussy and may require fixing signing settings in Xcode.
- Free personal-team installs may expire and require reinstalling.
- This path is for local testing, not persistent distribution.
- EAS iOS device builds, TestFlight, App Store submission, and durable team distribution require paid Apple credentials.

## Useful Commands

```sh
npm run start:dev-client
npx eas-cli build -p ios --profile development-simulator
npx eas-cli build:run -p ios
npm run ios:device
npm run typecheck
npm test
```

References:
- https://docs.expo.dev/versions/v56.0.0/
- https://docs.expo.dev/develop/development-builds/create-a-build/
- https://docs.expo.dev/build-reference/simulators/
- https://docs.expo.dev/guides/local-app-development/

## Verification Status

Completed locally:
- Confirmed Expo config resolves as SDK 56.
- Confirmed `expo start --dev-client` is available.
- Confirmed `eas.json` has `developmentClient: true` and `ios.simulator: true` for `development-simulator`.
- Confirmed `expo run:ios --device` is available.
- Confirmed Xcode is installed locally.

Still requires Expo login:
- Running `npx eas-cli build:inspect -p ios -e development-simulator -s archive -o /tmp/workout-tracker-eas-inspect --force`.
- Running the full simulator build with `npx eas-cli build -p ios --profile development-simulator`.
