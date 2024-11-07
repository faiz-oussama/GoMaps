package com.yarbi;

import java.net.URL;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.TextField;
import javafx.scene.layout.BorderPane;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

public class GeoJSONViewer extends Application {
    private WebEngine webEngine;

    @Override
    public void start(Stage primaryStage) {
        BorderPane root = new BorderPane();

        // Initialize WebView and load external HTML file
        WebView webView = new WebView();
        webEngine = webView.getEngine();
        webEngine.setOnError(event -> {
            System.out.println("WebEngine Error: " + event.getMessage());
        });
        webEngine.setOnAlert(event -> {
            System.out.println("WebEngine Alert: " + event.getData());
        });

        // Load the HTML file with map and GeoJSON data
        URL mapUrl = getClass().getResource("/javascript/index.html");
        if (mapUrl != null) {
            webEngine.load(mapUrl.toExternalForm());
        } else {
            System.err.println("map.html not found in resources.");
            return;
        }

        // Stylish Search Bar
        TextField searchField = new TextField();
        searchField.setPromptText("Enter place name...");
        searchField.setOnAction(event -> searchLocation(searchField.getText()));

        // Add the search bar at the top
        root.setTop(searchField);
        root.setCenter(webView);

        Scene scene = new Scene(root, 800, 600);
        primaryStage.setScene(scene);
        primaryStage.setTitle("GeoJSON Viewer for Morocco");
        primaryStage.show();
    }

    private void searchLocation(String query) {
        // Execute JavaScript search function in the WebView
        String script = String.format("searchLocation('%s');", query);
        webEngine.executeScript(script);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
