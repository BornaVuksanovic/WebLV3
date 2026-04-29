
		let sviFilmovi = [];
		let kosarica = [];

		function prikaziTablicu(podaci) {
			const tbody = document.getElementById('tablica-filmovi');
			tbody.innerHTML = ""; 

			podaci.forEach(film => {
				const row = document.createElement('tr');
				row.innerHTML = `
					<td>${film.Naslov}</td>
					<td>${film.Zanr}</td>
					<td>${film.Godina}</td>
					<td>${film.Trajanje_min} min</td>
					<td>${film.Ocjena}</td>
					<td>${film.Zemlja_porijekla}</td>
					<td><button class="btn-dodaj" onclick="dodajUKosaricu('${film.Naslov}')">Dodaj</button></td>
				`;
				tbody.appendChild(row);
			});
		}

		fetch('movies.csv')
			.then(res => res.text())
			.then(csv => {
				const rezultat = Papa.parse(csv, {
					header: true,
					skipEmptyLines: true,
					dynamicTyping: true 
				});
				sviFilmovi = rezultat.data;
				prikaziTablicu(sviFilmovi); 
			});

		
		const slider = document.getElementById('minOcjena');
		const ocjenaPrikaz = document.getElementById('ocjenaVrijednost');
		slider.addEventListener('input', () => {
			ocjenaPrikaz.textContent = slider.value;
		});

		
		document.getElementById('btnFiltriraj').addEventListener('click', () => {
			const naslovFilter = document.getElementById('searchNaslov').value.toLowerCase();
			const ocjenaFilter = parseFloat(document.getElementById('minOcjena').value);
			const drzavaFilter = document.querySelector('input[name="drzava"]:checked').value;

			const filtriraniFilmovi = sviFilmovi.filter(film => {
				// Provjera naslova
				const matchNaslov = film.Naslov.toLowerCase().includes(naslovFilter);
				
				// Provjera ocjene
				const matchOcjena = film.Ocjena >= ocjenaFilter;
				
				// Provjera države 
				let matchDrzava = true;
				if (drzavaFilter === "USA") {
					matchDrzava = film.Zemlja_porijekla.includes("USA");
				} else if (drzavaFilter === "Other") {
					matchDrzava = !film.Zemlja_porijekla.includes("USA");
				}

				return matchNaslov && matchOcjena && matchDrzava;
			});

			prikaziTablicu(filtriraniFilmovi);
		});
		


		function dodajUKosaricu(naslovFilma) {
			const film = sviFilmovi.find(f => f.Naslov === naslovFilma);
	
			if (kosarica.some(f => f.Naslov === naslovFilma)) {
				alert("Film je već u košarici!");
				return;
			}
			kosarica.push(film);
			osvjeziPrikazKosarice();
		}

		function ukloniIzKosarice(index) {
			kosarica.splice(index, 1);
			osvjeziPrikazKosarice();
		}

	
		function osvjeziPrikazKosarice() {
			const lista = document.getElementById('lista-kosarice');
			const brojac = document.getElementById('brojac-kosarice');
			const btnPotvrdi = document.getElementById('btnPotvrdiPosudbu');

			lista.innerHTML = "";
			brojac.textContent = kosarica.length;

			kosarica.forEach((film, index) => {
				const li = document.createElement('li');
				li.innerHTML = `
					<span><strong>${film.Naslov}</strong> (${film.Godina})</span>
					<button class="btn-ukloni" onclick="ukloniIzKosarice(${index})">X</button>
				`;
				lista.appendChild(li);
			});

			// Prikaži gumb za potvrdu samo ako ima filmova
			btnPotvrdi.style.display = kosarica.length > 0 ? "block" : "none";
		}


		document.getElementById('btnPotvrdiPosudbu').addEventListener('click', () => {
			const brojFilmova = kosarica.length;
			alert(`Uspješno ste dodali ${brojFilmova} filma u svoju košaricu za vikend maraton!`);
			
			// Isprazni košaricu nakon potvrde
			kosarica = [];
			osvjeziPrikazKosarice();
		});

