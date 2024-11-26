package com.yarbi;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;

import com.teamdev.jxbrowser.browser.Browser;
import com.teamdev.jxbrowser.engine.Engine;
import com.teamdev.jxbrowser.engine.EngineOptions;
import static com.teamdev.jxbrowser.engine.RenderingMode.HARDWARE_ACCELERATED;
import com.teamdev.jxbrowser.view.javafx.BrowserView;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

public class GoMaps extends Application {
    @Override
    public void start(Stage stage) {
        EngineOptions options = EngineOptions.newBuilder(HARDWARE_ACCELERATED)
                .licenseKey("OK6AEKNYF2JOKOYOR3NKEBSBKT2JTJI0XI3O7Z26JLXVGTSF5N9GQKVZ0VF0LWSMEEK4JWCN9N5KYRDKD23XMW8B6Q0P1IGPE0HOE4DQVEKPEQ9CV2RH8BHGK9U8V4Q1470XLIP711VIGED5Y")
                .build();
        Engine engine = Engine.newInstance(options);

        Browser browser = engine.newBrowser();
        BrowserView view = BrowserView.newInstance(browser);

        Scene scene = new Scene(new BorderPane(view), 1280, 700);

        Server server = new Server(8080);
        ServletContextHandler handler = new ServletContextHandler(ServletContextHandler.SESSIONS);
        handler.setResourceBase("src/main/resources");
        handler.setContextPath("/");
        server.setHandler(handler);

        try {
            server.start();
            System.out.println("Server started on http://localhost:8080");
        } catch (Exception e) {
            e.printStackTrace();
        }

        String url = "http://127.0.0.1:5500/demo/src/main/resources/javascript/index.html";
        browser.navigation().loadUrl(url);

        stage.getIcons().add(new Image(getClass().getResource("/javascript/l.png").toExternalForm()));

        stage.setScene(scene);
        stage.setTitle("GoMaps");
        stage.show();
        stage.setOnCloseRequest(event -> {
            browser.close();
            engine.close();
            try {
                server.stop();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public static void main(String[] args) {
        launch(args);
    }
}
