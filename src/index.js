import {useRef, useEffect} from 'react';
import {AppState, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';

const LocationTracker = ({onLocationUpdate}) => {
  const appStateRef = useRef(AppState.currentState);

  const getCurrentLocation = async () => {
    BackgroundTimer.runBackgroundTimer(() => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          // Pass coordinates and app state back to the component
          onLocationUpdate({
            latitude,
            longitude,
            appState: appStateRef.current,
          });
        },
        error => {
          console.log('Error getting location:', error);
        },
      );
    }, 10000);
  };

  const requestLocationPermissionIOS = async () => {
    const iOSPermissionStatus = await Geolocation.requestAuthorization(
      'always',
    );
    if (iOSPermissionStatus === 'granted') {
      console.log('Location permission granted on iOS.');
      getCurrentLocation();
    } else {
      console.log('Location permission denied on iOS.');
    }
  };

  const requestLocationPermissionAndroid = async () => {
    const androidPermissionStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app requires access to your location.',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );
    if (androidPermissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted on Android.');
      getCurrentLocation();
    } else {
      console.log('Location permission denied on Android.');
    }
  };

  const handleAppStateChange = nextAppState => {
    appStateRef.current = nextAppState;
    console.log('AppState', appStateRef.current);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    if (Platform.OS === 'ios') {
      requestLocationPermissionIOS();
    } else if (Platform.OS === 'android') {
      requestLocationPermissionAndroid();
    }

    return () => {
      subscription.remove();
      BackgroundTimer.stopBackgroundTimer();
    };
  });

  return null;
};

export default LocationTracker;
