package com.chanakya.taxistop;

import com.chanakya.taxistop.util.SystemUiHider;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.Window;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;


/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 *
 * @see SystemUiHider
 */
public class TaxiStopHome extends Activity {

    LocationManager locationManager;
    static Location SOURCE_LOCATION = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        locationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, new TaxiStopLocationListener(this));

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_taxistop_home);

        TaxiStopHome.SOURCE_LOCATION = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);

        final WebView taxiStopWebView = (WebView) findViewById(R.id.taxiStopWebView);

        WebSettings webSettings = taxiStopWebView.getSettings();
        String userAgent = webSettings.getUserAgentString();
        userAgent += " " + getString(R.string.user_agent_suffix);
        webSettings.setUserAgentString(userAgent);
        webSettings.setJavaScriptEnabled(true);

        taxiStopWebView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        taxiStopWebView.setWebViewClient(new TaxiStopWebViewClient());
        taxiStopWebView.addJavascriptInterface(new TaxiStopWebInterface(this), "Android");
        taxiStopWebView.loadUrl(getResources().getString(R.string.app_url));
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

    }

    private class TaxiStopWebViewClient extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return false;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            findViewById(R.id.taxiStopSplash).setVisibility(View.GONE);
            findViewById(R.id.taxiStopWebView).setVisibility(View.VISIBLE);
        }
    }

}