

import React, { useMemo, useState } from "react";
import {
  SafeAreaView, ScrollView, View, Text, TouchableOpacity,
  TextInput, Switch, StyleSheet, Alert
} from "react-native";

const FEATURES = [
  "Gebetszeiten", "Fajr-Wecker", "Qibla", "Koran", "Duas",
  "Arabisch lernen", "Tasbih", "Gebete tracken", "Wudu & Ghusl",
  "Ramadan-Kalender", "Prophetengeschichten", "Islam-Quiz",
  "Moschee finden", "Dua des Tages", "Freunde einladen",
  "Designs", "Kamera-Aufgabe", "Apps sperren", "Offline-Inhalte",
  "Mikrofon & Aussprache"
];

const DUAS = [
  { title: "Beim Beginn", ar: "بِسْمِ اللَّهِ", latin: "Bismillah", de: "Im Namen Allahs." },
  { title: "Dank", ar: "الْحَمْدُ لِلَّهِ", latin: "Alhamdulillah", de: "Alles Lob gebührt Allah." },
  { title: "Bitte um Wissen", ar: "رَبِّ زِدْنِي عِلْمًا", latin: "Rabbi zidni ilma", de: "Mein Herr, mehre mein Wissen." }
];

const LETTERS = [
  ["ا","Alif"],["ب","Ba"],["ت","Ta"],["ث","Tha"],["ج","Jim"],
  ["ح","Ha"],["خ","Kha"],["د","Dal"],["ذ","Dhal"],["ر","Ra"],
  ["ز","Zay"],["س","Sin"],["ش","Shin"],["ص","Sad"],["ض","Dad"],
  ["ط","Ta"],["ظ","Za"],["ع","Ayn"],["غ","Ghayn"],["ف","Fa"],
  ["ق","Qaf"],["ك","Kaf"],["ل","Lam"],["م","Mim"],["ن","Nun"],
  ["ه","Ha"],["و","Waw"],["ي","Ya"]
];

const QUIZ = [
  { q: "Wie viele Pflichtgebete gibt es täglich?", a: ["3", "5", "7"], correct: "5" },
  { q: "Wie heißt die Gebetsrichtung?", a: ["Qibla", "Tasbih", "Hijra"], correct: "Qibla" }
];

function Button({ title, onPress, secondary }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, secondary && styles.secondary]}>
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text>
    </TouchableOpacity>
  );
}

function Panel({ title, children }) {
  return <View style={styles.panel}><Text style={styles.panelTitle}>{title}</Text>{children}</View>;
}

function Note({ children }) {
  return <Text style={styles.note}>{children}</Text>;
}

export default function App() {
  const [screen, setScreen] = useState("Start");
  const [tasbih, setTasbih] = useState(0);
  const [prayed, setPrayed] = useState({});
  const [points, setPoints] = useState(0);
  const [alarm, setAlarm] = useState(false);
  const [camera, setCamera] = useState(false);
  const [focus, setFocus] = useState(false);
  const [inviteCode, setInviteCode] = useState("MW" + Math.random().toString(36).slice(2, 7).toUpperCase());
  const [redeem, setRedeem] = useState("");
  const [redeemed, setRedeemed] = useState(0);
  const [theme, setTheme] = useState("#123D35");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizMessage, setQuizMessage] = useState("");

  const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const completed = useMemo(
    () => prayerNames.filter(p => prayed[p]).length,
    [prayed]
  );

  function togglePrayer(name) {
    const next = !prayed[name];
    setPrayed(old => ({ ...old, [name]: next }));
    setPoints(old => Math.max(0, old + (next ? 10 : -10)));
  }

  function redeemCode() {
    if (redeem.trim().toUpperCase() === inviteCode && redeemed < 5) {
      Alert.alert("Nicht möglich", "Du kannst deinen eigenen Einladungscode nicht einlösen.");
    } else if (redeem.trim().length < 4) {
      Alert.alert("Code prüfen", "Bitte gib einen gültigen Einladungscode ein.");
    } else {
      Alert.alert("Demo-Modus", "Echte Einladungen müssen über einen gemeinsamen Server geprüft werden.");
    }
    setRedeem("");
  }

  function answerQuiz(answer) {
    const correct = answer === QUIZ[quizIndex].correct;
    setQuizMessage(correct ? "Richtig! +5 Punkte" : "Nicht ganz. Versuch es noch einmal.");
    if (correct) setPoints(p => p + 5);
  }

  function renderScreen() {
    switch (screen) {
      case "Gebetszeiten":
        return (
          <Panel title="Gebetszeiten">
            <Note>Die genauen Zeiten hängen von deinem Standort und deiner Berechnungsmethode ab. Diese Demo zeigt keine erfundenen Uhrzeiten.</Note>
            <Button title="Gebetszeiten einrichten" onPress={() => Alert.alert("Einrichtung", "Für echte Gebetszeiten muss ein Gebetszeiten-Dienst eingerichtet werden.")}/>
          </Panel>
        );

      case "Fajr-Wecker":
        return (
          <Panel title="Fajr-Wecker">
            <Note>Ein echter Wecker im Hintergrund benötigt zusätzliche Android-Alarm- und Benachrichtigungsfunktionen.</Note>
            <View style={styles.switchRow}>
              <Text style={styles.body}>Fajr-Erinnerung aktivieren</Text>
              <Switch value={alarm} onValueChange={setAlarm}/>
            </View>
            <Note>{alarm ? "In der Demo eingeschaltet – noch kein echter Alarm." : "Ausgeschaltet."}</Note>
          </Panel>
        );

      case "Qibla":
        return <Panel title="Qibla"><Note>Ein echter Kompass benötigt Sensorzugriff und Kalibrierung. Dieser Bereich ist vorbereitet.</Note></Panel>;

      case "Koran":
        return (
          <Panel title="Koran">
            <Note>Hier kommt der vollständige Koran mit arabischem Original, Übersetzung, Umschrift und Audio hinein. Der vollständige Korantext ist in dieser Demo noch nicht enthalten.</Note>
          </Panel>
        );

      case "Duas":
        return (
          <Panel title="Dua-Sammlung – Beispiele">
            {DUAS.map(d => (
              <View key={d.title} style={styles.item}>
                <Text style={styles.arabic}>{d.ar}</Text>
                <Text style={styles.bold}>{d.title} · {d.latin}</Text>
                <Text style={styles.body}>{d.de}</Text>
              </View>
            ))}
            <Note>Dies sind Beispiele, keine vollständige Dua-Sammlung.</Note>
          </Panel>
        );

      case "Arabisch lernen":
        return (
          <Panel title="Arabisches Alphabet">
            {LETTERS.map(([a, n]) => (
              <Text key={a + n} style={styles.letter}>
                {a}   <Text style={styles.body}>{n}</Text>
              </Text>
            ))}
          </Panel>
        );

      case "Tasbih":
        return (
          <Panel title="Tasbih-Zähler">
            <Text style={styles.counter}>{tasbih}</Text>
            <Button title="+1 zählen" onPress={() => setTasbih(n => n + 1)}/>
            <Button title="Zurücksetzen" secondary onPress={() => setTasbih(0)}/>
          </Panel>
        );

      case "Gebete tracken":
        return (
          <Panel title="Gebets-Tracker">
            {prayerNames.map(p => (
              <View key={p} style={styles.switchRow}>
                <Text style={styles.body}>{p}</Text>
                <Switch value={!!prayed[p]} onValueChange={() => togglePrayer(p)}/>
              </View>
            ))}
            <Text style={styles.bold}>Heute: {completed}/5 · Punkte: {points}</Text>
          </Panel>
        );

      case "Wudu & Ghusl":
        return (
          <Panel title="Wudu & Ghusl">
            <Text style={styles.body}>Wudu: Hände waschen, Mund und Nase reinigen, Gesicht waschen, Arme bis zu den Ellenbogen waschen, über den Kopf streichen und Füße waschen.</Text>
            <Note>Bitte lerne die genaue Durchführung mit einer vertrauenswürdigen religiösen Anleitung.</Note>
          </Panel>
        );

      case "Ramadan-Kalender":
        return <Panel title="Ramadan"><Note>Kalender sowie Suhur- und Iftar-Zeiten werden nach Ort und Jahr ergänzt.</Note></Panel>;

      case "Prophetengeschichten":
        return <Panel title="Prophetengeschichten"><Note>Hier können altersgerechte Geschichten und Lernkapitel ergänzt werden.</Note></Panel>;

      case "Islam-Quiz":
        return (
          <Panel title="Islam-Quiz">
            <Text style={styles.body}>{QUIZ[quizIndex].q}</Text>
            {QUIZ[quizIndex].a.map(a => (
              <Button key={a} title={a} onPress={() => answerQuiz(a)} secondary/>
            ))}
            <Text style={styles.body}>{quizMessage}</Text>
            <Button title="Nächste Frage" onPress={() => {
              setQuizIndex((quizIndex + 1) % QUIZ.length);
              setQuizMessage("");
            }}/>
          </Panel>
        );

      case "Moschee finden":
        return <Panel title="Moschee finden"><Note>Für eine echte Suche braucht die App einen Karten- oder Ortsdienst. Du kannst später auch eine Stadt manuell eingeben.</Note></Panel>;

      case "Dua des Tages":
        return (
          <Panel title="Dua des Tages">
            <Text style={styles.arabic}>{DUAS[0].ar}</Text>
            <Text style={styles.bold}>{DUAS[0].latin}</Text>
            <Text style={styles.body}>{DUAS[0].de}</Text>
          </Panel>
        );

      case "Freunde einladen":
        return (
          <Panel title="Freunde einladen">
            <Text style={styles.code}>{inviteCode}</Text>
            <Note>Demo-Code · maximal 5 Einlösungen · 7 Tage ab Erstellung. Diese Demo speichert Einlösungen nicht sicher zwischen Geräten.</Note>
            <Text style={styles.body}>Einlösungen in dieser Demo: {redeemed}/5</Text>
            <TextInput
              value={redeem}
              onChangeText={setRedeem}
              placeholder="Einladungscode eingeben"
              autoCapitalize="characters"
              style={styles.input}
            />
            <Button title="Code prüfen" onPress={redeemCode}/>
            <Button title="Neuen Demo-Code erstellen" secondary onPress={() => {
              setInviteCode("MW" + Math.random().toString(36).slice(2, 7).toUpperCase());
              setRedeemed(0);
            }}/>
          </Panel>
        );

      case "Designs":
        return (
          <Panel title="Designs">
            <Text style={styles.body}>Punkte: {points}</Text>
            {["#123D35", "#234A75", "#70466E", "#8A5B2B"].map(c => (
              <Button key={c} title={"Design " + c} secondary onPress={() => setTheme(c)}/>
            ))}
            <Note>Nur das Aussehen ändert sich. Religiöse Funktionen bleiben kostenlos.</Note>
          </Panel>
        );

      case "Kamera-Aufgabe":
        return (
          <Panel title="Kamera-Aufgabe">
            <Note>Die Kamera ist noch nicht eingebunden. Eine Foto-Aufgabe sollte freiwillig sein und Fotos möglichst nur auf deinem Gerät verarbeiten – nicht automatisch hochladen.</Note>
            <View style={styles.switchRow}>
              <Text style={styles.body}>Aufgabe vormerken</Text>
              <Switch value={camera} onValueChange={setCamera}/>
            </View>
          </Panel>
        );

      case "Apps sperren":
        return (
          <Panel title="Apps sperren">
            <Note>Eine echte App-Sperre ist mit Expo Snack allein nicht möglich. Android benötigt dafür spezielle native Funktionen und Berechtigungen. Diese Demo sperrt keine Apps.</Note>
            <View style={styles.switchRow}>
              <Text style={styles.body}>Fokusmodus vormerken</Text>
              <Switch value={focus} onValueChange={setFocus}/>
            </View>
          </Panel>
        );

      case "Offline-Inhalte":
        return <Panel title="Offline-Inhalte"><Note>Zum Offline-Lesen müssen Quran-, Dua- und Lerninhalte erst lokal gespeichert werden.</Note></Panel>;

      case "Mikrofon & Aussprache":
        return <Panel title="Mikrofon & Aussprache"><Note>Spracherkennung und Aussprachebewertung benötigen Mikrofonzugriff und einen geeigneten arabischen Spracherkennungsdienst. Noch nicht aktiv.</Note></Panel>;

      default:
        return <View>{FEATURES.map(f => <Button key={f} title={f} onPress={() => setScreen(f)}/>)}</View>;
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme }]}>
      <View style={styles.header}>
        <Text style={styles.brand}>Muslim World</Text>
        <Text style={styles.points}>Punkte: {points}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {screen !== "Start" && (
          <Button title="← Zur Startseite" secondary onPress={() => setScreen("Start")}/>
        )}
        {screen === "Start" && (
          <>
            <Text style={styles.welcome}>Dein kostenloser islamischer Begleiter</Text>
            <Note>Alle religiösen Grundfunktionen sind kostenlos. Dies ist ein Prototyp. Einige Gerätefunktionen brauchen später eine native Android-Einrichtung.</Note>
          </>
        )}
        {renderScreen()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: "white", fontSize: 24, fontWeight: "bold" },
  points: { color: "white", fontWeight: "bold" },
  content: { padding: 16, paddingBottom: 40 },
  welcome: { color: "white", fontSize: 21, fontWeight: "bold", marginBottom: 10 },
  button: { backgroundColor: "#D8B56D", padding: 14, borderRadius: 12, marginVertical: 5 },
  buttonText: { color: "#172B27", fontWeight: "bold", textAlign: "center" },
  secondary: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D8B56D" },
  secondaryText: { color: "#173B34" },
  panel: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginTop: 12 },
  panelTitle: { fontSize: 20, fontWeight: "bold", color: "#173B34", marginBottom: 12 },
  body: { color: "#26332F", fontSize: 16, lineHeight: 23 },
  note: { color: "#53635D", fontSize: 14, lineHeight: 21, marginVertical: 8 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  counter: { fontSize: 56, textAlign: "center", color: "#173B34", fontWeight: "bold", margin: 15 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#E4E8E5" },
  arabic: { fontSize: 30, color: "#173B34", textAlign: "right", marginVertical: 8 },
  bold: { color: "#173B34", fontWeight: "bold", fontSize: 16, marginVertical: 5 },
  letter: { color: "#173B34", fontSize: 27, paddingVertical: 5 },
  code: { fontSize: 28, textAlign: "center", color: "#173B34", fontWeight: "bold", letterSpacing: 3, margin: 10 },
  input: { borderWidth: 1, borderColor: "#C9D2CD", borderRadius: 10, padding: 12, marginVertical: 10, color: "#172B27" }
});
