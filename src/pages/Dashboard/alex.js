function Wohneinheiten() {

    // 1. Hier definiere ich eine variable (woheinheiten) 
    // und eine funktion (setWohneinheiten)
    const [wohneinheiten, setWohneinheiten] = useState([])

    // Hier habe ich keine Ahnung, hab ich einfach uebernonmmen
    useEffect(() => {
        getData()
    }, [])

    // 2. Hier wird eine konstante getDate definiert
    const getData = async () => {

        // Hier speichern wir in der Variable wohneinheitenResponse
        // die Daten die auf dem DJANGO server liegen. 
        // Mit fetch greifen wir auf den lokalen Server zu,
        // den wir durch den command "python manage.py runserver" initialisieren.
        // Der Server befindet sich standardmaessig auf "http://localhost:8000"
        // mit '/consumers/', welches der fetch Funktion uebergeben wird
        // landen wir dann auf http://localhost:8000/consumers/
        // Von dort werden dann die Daten, die sich
        // auf dieser Page befinden in wohneinheitenResponse gespeichert.
        const wohneinheitenResponse = await fetch('/consumers/')
        // Hier wandeln wir die gespeicherten Daten ins json() format um
        // und speichern das Ergebnis in der Variable wohneinheitenData
        const wohneinheitenData = await wohneinheitenResponse.json()
        // Mit der setWohneinheiten Funktion, welche wir am Anfang definiert haben
        // siehe  OBEN: "const [wohneinheiten, setWohneinheiten] = useState([])"
        // speichern wir die wohneinheitenData in der variable 'wohneinheiten'
        // Dadurch haben wir dann auch ausserhalb von der const "getData"
        // Zugriff auf die Daten
        setWohneinheiten(wohneinheitenData)

    }




    
    // 3.Jz muessen wir definieren, 
    // was die function "Wohneinheiten" zurueckgeben soll (return())
    return (
            // Hier lassen wir und ueber die Konsole, die eben gefetchten Daten
            // anzeigen, um zu pruefen, ob alles so ist wie gewollt
            // console.log(wohneinheiten)
            // Hier ist der eigentliche COntent der Rueckgabe.
            // die Funktion "map" ist wie eine for bzw while schleife
            // Da wir in "wohneinheiten" alle wohneinheiten gespeichert haben,
            // aber nur den namen benoetigen, iterieren wir mit "map" ueber
            // die wohneinheiten. Fuer jede wohneinheit wird dann der name
            // als liste(<li></li> - tags) ausgegeben
          <div>
            {wohneinheiten.map(wohneinheit => 
                <li> 
                {wohneinheit.name}
                </li>
                )
            }
          </div>
       
       
    )
}
//4. Hier exportieren wir die so eben definierte Funktion
export default Wohneinheiten