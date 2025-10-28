package com.infinite.kdiscoms;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.content.Intent;

/**
 * This class echoes a string called from JavaScript.
 */
public class OpenIntent extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("openGisIntent")) {
            this.openGisIntent(args, callbackContext);
            return true;
        }
        return false;
    }

    private void openGisIntent(JSONArray args, CallbackContext callbackContext) {
        if (args != null && args.length() > 2) {
            Intent intent = new Intent();
            intent.setClassName("com.infinite.gis", "com.infinite.gis.ExternalMapView");

            try{
                // Adding data to the intent
                intent.putExtra("NearestConsumerAccountID", args.getString(0));
                intent.putExtra("TargetAsset", args.getString(1));
                intent.putExtra("WorkOrder", args.getString(2));
            } catch (Exception e) {
                callbackContext.error(e.toString());
            }
            
            cordova.getActivity().startActivity(intent);
            callbackContext.success("Intent Opened Successfully");
        } else {
            callbackContext.error("Need Three Parameters NearestConsumerAccountID, TargetAsset & WorkOrder ");
        }
    }
}
