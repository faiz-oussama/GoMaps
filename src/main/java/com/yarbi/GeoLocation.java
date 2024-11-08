package com.yarbi;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;

public class GeoLocation {

    public static double[] getUserLocation() {
        try {
            URL url = new URL("http://ip-api.com/json/");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuilder content = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }

            in.close();
            connection.disconnect();

            JSONObject json = new JSONObject(content.toString());
            double latitude = json.getDouble("lat");
            double longitude = json.getDouble("lon");

            return new double[] { latitude, longitude };
        } catch (Exception e) {
            e.printStackTrace();
            return null; // Return null if the location couldn't be determined
        }
    }
}
