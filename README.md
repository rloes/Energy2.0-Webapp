# Energy 2.0 Webanwendung
Dies ist das Repository für die Webanwendung der [Energy 2.0 Anwendung](https://github.com/s1n7/Energy2.0), die im Rahmen des Projektseminars erstellt wurde.

## Installation
1. Installieren Sie node.js und npm
2. Klonen Sie das Repository auf Ihren lokalen Computer  
   `git clone git@github.com:rloes/Energy2.0-Webapp.git`
3. Ghen sie in das Projektstammverzeichnis  
   `cd Energy2.0-Webapp`
4. Installieren Sie alle nötigen Packages  
   `npm install`
5. Falls das Backend nicht lokal auf dem Port 8000 läuft -> passen Sie die Backend-URL unter _src/hooks/useApi_ an 
6. Starten Sie den Entwicklungsserver  
   `npm start`

## Struktur
Der Einstiegspunkt ist `src/App.js`, wo alle Routen definiert sind.

- [Komponenten](#komponenten-srccomponents)
- [Hooks](#hooks-srchooks)
- [Seiten](#seiten-srcpages)
- [Stores](#stores-srcstores)

### Komponenten (_src/components_)
Alle Komponenten, die in der gesamten Anwendung geteilt werden, werden hier gespeichert. Wenn sie lokale Hooks oder Styles benötigen, können sie in einem dedizierten Ordner mit Hooks- und Style-Unterverzeichnissen gespeichert werden.

Beispiele:
- ListEntityTable
- StyledButtons

### Hooks (_src/hooks_)
Alle Hooks, die in der gesamten Anwendung geteilt werden.
Beispiele:
- useForm
- useApi

### Seiten (_src/pages_)
Alle Top-Level-Komponenten, die als eigene Route gerendert werden, werden hier gespeichert. Sie können in einem Verzeichnis gespeichert werden, wenn sie lokale Komponenten, Hooks oder Styles erfordern.

Beispiele:
- AddProducer
- Login

### Stores (_src/stores_)
Der globale Zustand wird in Stores gespeichert. Wir verwenden [zustand](https://github.com/pmndrs/zustand) für das Zustandsmanagement.

Beispiele:
- AuthorizationStore
- NotificationStore
