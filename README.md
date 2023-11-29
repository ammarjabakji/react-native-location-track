# react-native-location-tracker

A simple React Native library for efficiently logging and tracking user locations in both foreground and background.

## Installation

```sh
npm install react-native-location-track

```

or

```sh

yarn add react-native-location-track
```

Required dependencies

```sh
npm install react-native-background-timer react-native-geolocation-service

```

or

```sh
yarn add yarn add react-native-background-timer react-native-geolocation-service
```

**On Android**

> One thing to note, for android this library assumes that location permission is already granted by the user, so you have to use PermissionsAndroid to request for permission before making the location request.

**On iOS, you have to add the following to the Info.plist**

```

<key>NSLocationWhenInUseUsageDescription</key>

<string>This app requires access to your location when in use to provide personalized recommendations.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>

<string>This app requires access to your location to track your activities.</string>

<key>NSLocationAlwaysUsageDescription</key>

<string>This app requires access to your location when in use Always.</string>

```

## Usage

Before running your app on iOS, make sure you have CocoaPods installed and run:

```
cd ios
pod install
```

import LocationTracher

```js
import LocationTracker from 'react-native-location-track';

// ...
```

Example: Logging and Tracking Coordinates

```js
import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import LocationTracker from 'react-native-location-track';

const App = () => {
  const [locationList, setLocationList] = useState([]);
  const scrollRef = useRef(null);

  const handleLocationUpdate = ({latitude, longitude, appState}) => {
    // Add the new location entry to the list
    const newLocationEntry = `${latitude}, ${longitude} (${appState})`;
    setLocationList(prevList => [...prevList, newLocationEntry]);

    // Scroll to the bottom of the ScrollView when a new entry is added
    scrollRef.current.scrollToEnd({animated: true});
  };

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef} style={styles.scrollView}>
        {locationList.map((entry, index) => (
          <Text key={index}>{entry}</Text>
        ))}
      </ScrollView>
      <LocationTracker onLocationUpdate={handleLocationUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
});

export default App;
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---
