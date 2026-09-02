import { Alert, Platform } from 'react-native';

/**
 * Boîtes de dialogue utilisables sur les trois plateformes.
 *
 * `Alert.alert` de react-native-web est une fonction vide : sur le web, toute
 * confirmation passée par lui ne s'affiche jamais et l'action associée n'est
 * jamais exécutée. On bascule donc sur les dialogues natifs du navigateur.
 */

export function notify(title: string, message?: string): void {
  if (Platform.OS === 'web') {
    globalThis.alert?.(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
}

export function confirm(options: ConfirmOptions): Promise<boolean> {
  const { title, message, confirmLabel, cancelLabel, destructive } = options;

  if (Platform.OS === 'web') {
    const accepted = globalThis.confirm?.(message ? `${title}\n\n${message}` : title) ?? false;
    return Promise.resolve(accepted);
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: cancelLabel, style: 'cancel', onPress: () => resolve(false) },
      {
        text: confirmLabel,
        style: destructive ? 'destructive' : 'default',
        onPress: () => resolve(true),
      },
    ]);
  });
}
