# react-native-location-tracker

A simple approach to log and track location using React Native.

## Installation

```sh
npm install react-native-location-track
```

```sh
yarn add react-native-location-track
```

## Usage

import LocationTracher

```js
import {LocationTracker} from 'react-native-location-track';

// ...
```

See the full example to log track coordinates in both forground and background

```js
import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {LocationTracker} from 'react-native-location-track';

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
