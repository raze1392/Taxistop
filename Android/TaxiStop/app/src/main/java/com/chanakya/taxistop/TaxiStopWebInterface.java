package com.chanakya.taxistop;

import android.content.Context;
import android.webkit.JavascriptInterface;

/**
 * Created by shivshah on 07/02/15.
 */
public class TaxiStopWebInterface {
    Context mContext;

    public TaxiStopWebInterface(Context c) {
        mContext = c;
    }

    @JavascriptInterface
    public String getUserLocation() {
        return TaxiStopHome.SOURCE_LOCATION.getLatitude() + "|" + TaxiStopHome.SOURCE_LOCATION.getLongitude();
    }


}
