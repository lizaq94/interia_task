# Saper

Implementacja sapera w React + TypeScript, z planszami wczytywanymi z pliku `saper-plansze.json`.

## Wymagania

- **Node.js 22.13 lub nowszy** (zalecane 24 LTS)
- **npm 10 lub nowszy**

## Jak uruchomić

```bash
git clone <adres-repo> saper
cd saper
npm ci
npm run dev
```

Aplikacja startuje pod `http://localhost:5173/`. Pozostałe komendy:

```bash
npm test -- --run   # testy jednostkowe raz (samo `npm test` uruchamia tryb watch)
npm run typecheck   # tsc -b --noEmit
npm run lint        # eslint
npm run build       # tsc -b && vite build
npm run preview     # podgląd builda na http://localhost:4173/
```

## Co zrobiłem, a czego nie

Zrobiona jest pełna logika gry: odkrywanie pól, kaskada pustych pól, oznaczanie flagą, chording, wykrywanie
wygranej i przegranej, bezpieczny pierwszy ruch, wybór poziomu z pliku JSON, licznik pozostałych min
i restart.

Przez ograniczony czas nie zrobiłem timera, zapisu wyników. Nie ma pełnych testów jednostkowych, testów
komponentów ani testów E2E. Brakuje też dostępności planszy: pola nie mają dostępnej nazwy dla czytnika ekranu a po siatce chodzi się tabulatorem zamiast strzałkami.

## Co znalazłem w danych

Plik z planszami ma celowo (albo nie) kilka niespójności. Przeszedłem po wszystkich poziomach
i porównałem deklarowany `mineCount` z tym, co faktycznie ląduje na planszy:

| poziom              | rozmiar | `mineCount` | min w tablicy | min na planszy |
| ------------------- | ------- | ----------- | ------------- | -------------- |
| Rozgrzewka          | 9×9     | 10          | 10            | 10             |
| Spacer              | 12×10   | 18          | 18            | 18             |
| Pomyłka rachmistrza | 9×9     | 10          | 12            | 12             |
| Bliźnięta           | 9×9     | 8           | 8             | 7              |
| Za płotem           | 8×8     | 6           | 6             | 5              |
| Łąka                | 5×5     | 0           | 0             | 0              |
| Ciasno              | 3×3     | 9           | 9             | 9              |

Przyjąłem jedną zasadę: źródłem prawdy jest tablica `mines`, a nie pole `mineCount`.

- Pomyłka rachmistrza - ma więcej min niż zadeklarowano. Zamiast wywalać błąd gra się w nią prawidłowo.
- Bliźnięta - dwa razy występują te same współrzędne min. Współrzędnę trafiają do `Set` więc duplikat znika.
- Za płotem - jedna mina stoi poza planszą. Sprawdzam czy współrzędne miny są w granicach planszy, jeśli nie są odrzucane.
- Łąka - plansza bez min. Pierwsze kliknięcie odkrywa całą planszę i wygrywa gracz.
- Ciasno - plansza z samymi minami. Kliknięcie kończy grę.

## Co było najtrudniejsze

Najtrudniejsze było kaskadowe odkrywanie pustych pól. Dla lepszego zrozumienia działania, rozrysowałem sobie plansze 3x3 i przeszedłem algorymt ręcznie.
Dzięki czemu łatwiej było wychwycić listę potrzebnych warunków.

## Jakich bibliotek użyłem

Runtime praktycznie nie ma zależności — poza Reactem nie użyłem żadnej biblioteki. Nie ma tu
zarządzania stanem, biblioteki UI ani utilsów, bo cała gra to jedna tablica komórek i kilka czystych
funkcji.

## Co zrobiłbym dalej

- Walidacje danych wejściowych np za pomocą Zod. Plus raporty ostrzeżeń o błędach w levelach.
- Timer
- Licznik wyników.
- Pełną obsługę klawiatury oraz poprawił wartstwę dostępności.
- Testy komponentów
- Testy E2E
- CI

## Gdzie korzystałem z AI

- Konfiguracja projektu
- Konsultacje
- Stworzenie szkieletu komponentów
- Przeniesienie stylów ze zmiennych Sass na zmienne CSS.
- Stowrzenie szkieletu tego pliku.
