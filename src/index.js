import {useRef, useEffect, useCallback} from 'react';
import {AppState, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';

const LocationTracker = ({onLocationChanged, config}) => {
  const appStateRef = useRef(AppState.currentState);
  const timerRef = useRef(null);

  const getCurrentLocation = useCallback(() => {
    if (timerRef.current) {
      BackgroundTimer.clearInterval(timerRef.current);
    }

    timerRef.current = BackgroundTimer.setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          onLocationChanged({
            latitude,
            longitude,
            appState: appStateRef.current,
          });
        },
        error => {
          console.log('Error getting location:', error);
        },
      );
    }, config.interval);
  }, [onLocationChanged, appStateRef, config.interval]);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      const iOSPermissionStatus = await Geolocation.requestAuthorization(
        'always',
      );
      if (iOSPermissionStatus === 'granted') {
        console.log('Location permission granted on iOS.');
        getCurrentLocation();
      } else {
        console.log('Location permission denied on iOS.');
      }
    } else if (Platform.OS === 'android') {
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
    }
  }, [getCurrentLocation]);

  const handleAppStateChange = useCallback(nextAppState => {
    appStateRef.current = nextAppState;
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    requestLocationPermission();
    getCurrentLocation();

    return () => {
      subscription.remove();
      if (timerRef.current) {
        BackgroundTimer.clearInterval(timerRef.current);
      }
    };
  }, [handleAppStateChange, requestLocationPermission, getCurrentLocation]);

  return null;
};

export default LocationTracker;
