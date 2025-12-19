
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NativeBuildGuideProps {
  onClose: () => void;
}

type Platform = 'android' | 'ios' | 'reactnative' | 'desktop';
type Tab = 'database' | 'logic' | 'ui';

export const NativeBuildGuide: React.FC<NativeBuildGuideProps> = ({ onClose }) => {
  const [platform, setPlatform] = useState<Platform>('android');
  const [activeTab, setActiveTab] = useState<Tab>('database');

  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    return (
        <button 
            onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }}
            className="absolute top-4 right-4 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300 transition-colors z-10"
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    )
  }

  const CodeBlock = ({ title, code }: { title: string, code: string }) => (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden relative group">
        <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400">{title}</span>
        </div>
        <CopyButton text={code} />
        <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed custom-scrollbar">
            {code}
        </pre>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 min-h-screen">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-background/95 backdrop-blur py-4 z-10 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center border border-indigo-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">Native Build Guide</h2>
                <p className="text-xs text-slate-400">Offline Source Code for All Platforms</p>
             </div>
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700">Close</button>
        </div>

        {/* Platform Selector */}
        <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700 whitespace-nowrap">
                {[
                    { id: 'android', label: 'Android (Kotlin)', icon: '🤖' },
                    { id: 'ios', label: 'iOS (Swift)', icon: '🍎' },
                    { id: 'reactnative', label: 'React Native (All Phones)', icon: '⚛️' },
                    { id: 'desktop', label: 'Desktop (Electron)', icon: '🖥️' }
                ].map((p) => (
                    <button
                        key={p.id}
                        onClick={() => {
                            setPlatform(p.id as Platform);
                            setActiveTab('database'); // Reset sub-tab
                        }}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${platform === p.id ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <span>{p.icon}</span> {p.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="space-y-2">
                <button 
                    onClick={() => setActiveTab('database')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'database' ? 'bg-slate-800 text-primary border border-slate-700' : 'text-slate-400 hover:bg-slate-800/50'}`}
                >
                    1. Data Layer
                </button>
                <button 
                    onClick={() => setActiveTab('logic')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'logic' ? 'bg-slate-800 text-primary border border-slate-700' : 'text-slate-400 hover:bg-slate-800/50'}`}
                >
                    2. Core Logic & UI
                </button>
                {platform === 'desktop' && (
                     <button 
                        onClick={() => setActiveTab('ui')}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ui' ? 'bg-slate-800 text-primary border border-slate-700' : 'text-slate-400 hover:bg-slate-800/50'}`}
                    >
                        3. System Overlay
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="md:col-span-3 space-y-6">
                
                {/* ================= ANDROID CONTENT ================= */}
                {platform === 'android' && (
                    <motion.div key="android" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        {activeTab === 'database' && (
                            <>
                                <CodeBlock 
                                    title="Profile.kt & UsageLog.kt (Room Entities)"
                                    code={`@Entity(tableName = "profiles")
data class Profile(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val startTime: String,   // "21:00"
    val endTime: String,     // "07:00"
    val opacity: Int,        // 0–100
    val warmth: Int,         // 1–10
    val daysOfWeek: String,  // "1,2,3,4,5"
    val isActive: Boolean = false
)

@Entity(tableName = "usage_logs")
data class UsageLog(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val date: String,
    val durationMinutes: Int
)`}
                                />
                                <CodeBlock 
                                    title="AppDatabase.kt (Room Setup)"
                                    code={`@Database(entities = [Profile::class, UsageLog::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun profileDao(): ProfileDao
    abstract fun usageLogDao(): UsageLogDao

    companion object {
        @Volatile private var INSTANCE: AppDatabase? = null
        fun get(context: Context): AppDatabase =
            INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java, "eyecomfort.db"
                ).build().also { INSTANCE = it }
            }
    }
}`}
                                />
                            </>
                        )}

                        {activeTab === 'logic' && (
                            <CodeBlock 
                                title="MainActivity.kt (Permission & Overlay)"
                                code={`class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Check Overlay Permission
        if (!Settings.canDrawOverlays(this)) {
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))
            startActivityForResult(intent, 1001)
        }

        // Toggle Service
        findViewById<SwitchMaterial>(R.id.switchFilter).setOnCheckedChangeListener { _, isChecked ->
            val intent = Intent(this, OverlayService::class.java)
            if (isChecked) startForegroundService(intent)
            else stopService(intent)
        }
    }
}

// OverlayService.kt
class OverlayService : Service() {
    override fun onCreate() {
        val windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY, // Key for system overlay
            WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )
        val overlayView = View(this)
        overlayView.setBackgroundColor(Color.argb(50, 255, 150, 0)) // Warmth
        windowManager.addView(overlayView, params)
    }
}`}
                            />
                        )}
                    </motion.div>
                )}

                {/* ================= iOS CONTENT ================= */}
                {platform === 'ios' && (
                    <motion.div key="ios" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                         <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-sm">
                            ⚠️ Note: iOS sandboxing prevents "System-Wide" overlays for standard apps. This code creates a functional filter within your app.
                        </div>

                        {activeTab === 'database' && (
                            <CodeBlock 
                                title="Persistence.swift (SwiftData)"
                                code={`import SwiftData

@Model
class Profile {
    var name: String
    var startTime: Date
    var endTime: Date
    var opacity: Double
    var warmth: Double
    
    init(name: String, opacity: Double, warmth: Double) {
        self.name = name
        self.opacity = opacity
        self.warmth = warmth
        self.startTime = Date()
        self.endTime = Date()
    }
}

// App Entry
@main
struct EyeComfortApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: Profile.self)
    }
}`}
                            />
                        )}

                        {activeTab === 'logic' && (
                            <CodeBlock 
                                title="ContentView.swift (SwiftUI Overlay)"
                                code={`import SwiftUI

struct ContentView: View {
    @State private var opacity: Double = 0.3
    @State private var warmth: Double = 0.5
    @State private var isEnabled: Bool = false
    
    var body: some View {
        ZStack {
            // Main App Content
            VStack {
                Toggle("Enable Filter", isOn: $isEnabled)
                    .padding()
                
                Slider(value: $opacity, in: 0...0.8) { Text("Opacity") }
                Slider(value: $warmth, in: 0...1.0) { Text("Warmth") }
            }
            .padding()
            
            // Filter Overlay
            if isEnabled {
                Rectangle()
                    .fill(Color(red: 1.0, green: 0.8 - (warmth * 0.3), blue: 0.6 - (warmth * 0.5)))
                    .opacity(opacity)
                    .allowsHitTesting(false) // Click-through
                    .edgesIgnoringSafeArea(.all)
            }
        }
    }
}`}
                            />
                        )}
                    </motion.div>
                )}

                {/* ================= REACT NATIVE CONTENT ================= */}
                {platform === 'reactnative' && (
                    <motion.div key="reactnative" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                         <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-200 text-sm">
                            ⚛️ <strong>Write Once, Run Everywhere.</strong> React Native allows you to build for Android and iOS with a single JavaScript/TypeScript codebase.
                        </div>

                        {activeTab === 'database' && (
                            <CodeBlock 
                                title="storage.ts (AsyncStorage)"
                                code={`import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveSettings = async (settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem('@eye_comfort_settings', jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const getSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@eye_comfort_settings');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};`}
                            />
                        )}

                        {activeTab === 'logic' && (
                            <CodeBlock 
                                title="App.tsx (Cross-Platform Overlay)"
                                code={`import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Switch, Text } from 'react-native';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [enabled, setEnabled] = useState(false);
  const [opacity, setOpacity] = useState(0.3);
  const [warmth, setWarmth] = useState(5);

  const getOverlayColor = () => {
    // Warmth logic: 1 (yellow) to 10 (orange/red)
    const red = 255;
    const green = 220 - ((warmth - 1) * 8);
    const blue = Math.max(0, 150 - ((warmth - 1) * 10));
    return \`rgba(\${red}, \${green}, \${blue}, \${opacity})\`;
  };

  return (
    <View style={styles.container}>
      {/* UI Controls */}
      <View style={styles.controls}>
        <Text style={styles.title}>Eye Comfort</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
        <Slider 
          value={opacity} 
          onValueChange={setOpacity} 
          minimumValue={0} 
          maximumValue={0.8} 
        />
      </View>

      {/* The Overlay (PointerEvents None allows click-through to app) */}
      {enabled && (
        <View 
          style={[styles.overlay, { backgroundColor: getOverlayColor() }]} 
          pointerEvents="none" 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e293b' },
  controls: { padding: 40, marginTop: 100 },
  title: { color: 'white', fontSize: 24, marginBottom: 20 },
  overlay: {
    position: 'absolute',
    top: 0, left: 0,
    width: width, height: height,
    zIndex: 999, // Stays on top of app content
    elevation: 10 // Android Z-index equivalent
  }
});`}
                            />
                        )}
                    </motion.div>
                )}

                {/* ================= DESKTOP / SYSTEM CONTENT ================= */}
                {platform === 'desktop' && (
                    <motion.div key="desktop" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-200 text-sm">
                            💡 Pro Tip: Use <strong>Electron.js</strong> to build a system-wide overlay that works on Windows, macOS, and Linux. The key is `setIgnoreMouseEvents`.
                        </div>

                        {activeTab === 'database' && (
                             <CodeBlock 
                                title="store.js (Local Storage)"
                                code={`const Store = require('electron-store');
const store = new Store({
    defaults: {
        settings: {
            opacity: 30,
            warmth: 5,
            schedule: { enabled: false, start: '21:00', end: '07:00' }
        }
    }
});

// Usage
const opacity = store.get('settings.opacity');
store.set('settings.opacity', 50);`}
                            />
                        )}

                        {activeTab === 'logic' && (
                            <CodeBlock 
                                title="main.js (System Overlay Window)"
                                code={`const { app, BrowserWindow, screen } = require('electron');

let overlayWindow;

app.whenReady().then(() => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    overlayWindow = new BrowserWindow({
        width,
        height,
        transparent: true,
        frame: false,
        alwaysOnTop: true, // Key for system overlay
        skipTaskbar: true,
        webPreferences: { nodeIntegration: true }
    });

    // Make it click-through (SYSTEM LEVEL)
    overlayWindow.setIgnoreMouseEvents(true);

    // Load the HTML that contains the color div
    overlayWindow.loadFile('overlay.html');
});`}
                            />
                        )}

                        {activeTab === 'ui' && (
                            <CodeBlock 
                                title="overlay.html (The Filter Visual)"
                                code={`<!DOCTYPE html>
<html>
<body style="margin: 0; overflow: hidden; background: transparent;">
    <div id="filter" style="
        width: 100vw; 
        height: 100vh; 
        background: rgba(255, 140, 0, 0.3); /* Warm Orange */
        pointer-events: none;">
    </div>
    <script>
        const { ipcRenderer } = require('electron');
        
        // Listen for updates from Main Control Window
        ipcRenderer.on('update-filter', (event, { opacity, warmth }) => {
            const filter = document.getElementById('filter');
            filter.style.opacity = opacity / 100;
            // Update color based on warmth math...
        });
    </script>
</body>
</html>`}
                            />
                        )}
                    </motion.div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};
