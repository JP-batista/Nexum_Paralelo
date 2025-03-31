import { AppRegistry } from 'react-native';
import App from './App'; // Aponte para o seu componente principal
import { name as appName } from './app.json';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  import 'react-native-gesture-handler';
  import 'react-native-reanimated';
}

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});
