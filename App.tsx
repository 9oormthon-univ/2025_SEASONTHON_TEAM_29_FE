import React from 'react';
import {ActivityIndicator, StyleSheet, View, StatusBar} from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
            <WebView
                source={{ uri: 'https://wedit.me/' }}
                style={styles.webview}
                mixedContentMode="always" // Android에서 http/https 모두 허용 (필요 시만)
                javaScriptEnabled
                domStorageEnabled
                allowsInlineMediaPlayback={true} // iOS 자동 재생 허용
                mediaPlaybackRequiresUserAction={false} // true면 유저 동작 필요
                originWhitelist={['https://*']} // 모든 HTTPS만 허용
                startInLoadingState={true} // 로딩 중 indicator
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            color="#999999"
                            size="large"
                        />
                    </View>
                )}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
                onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView HTTP error: ', nativeEvent);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
});
