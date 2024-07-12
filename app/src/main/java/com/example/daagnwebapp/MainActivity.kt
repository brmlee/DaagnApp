package com.example.daagnwebapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.daagnwebapp.ui.theme.DaagnWebAppTheme
import android.annotation.SuppressLint
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        webView.settings.javaScriptEnabled = true
        webView.addJavascriptInterface(WebAppInterface(this), "Android")

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                loadTodosFromStorage()
            }
        }

        webView.loadUrl("file:///android_asset/index.html")
    }

    private fun loadTodosFromStorage() {
        val sharedPref = getSharedPreferences("TodoPrefs", MODE_PRIVATE)
        val todosJson = sharedPref.getString("todos", "[]")
        webView.evaluateJavascript("setTodosFromAndroid('$todosJson')", null)
    }

    inner class WebAppInterface(private val activity: MainActivity) {
        @JavascriptInterface
        fun saveTodos(todos: String) {
            val sharedPref = activity.getSharedPreferences("TodoPrefs", MODE_PRIVATE)
            with(sharedPref.edit()) {
                putString("todos", todos)
                apply()
            }
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    DaagnWebAppTheme {
        Greeting("Android")
    }
}