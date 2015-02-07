package com.chanakya.taxistop;

import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;

/**
 * Created by shivshah on 07/02/15.
 */
public class TaxiStopLocationListener implements LocationListener {
    Context mContext;

    public TaxiStopLocationListener(Context c) {
        mContext = c;
    }

    @Override
    public void onLocationChanged(Location location) {
        TaxiStopHome.SOURCE_LOCATION = location;

    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public void onProviderEnabled(String provider) {

    }

    @Override
    public void onProviderDisabled(String provider) {

    }
}
