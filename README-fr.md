# Logs Simulator v1.0.0

[README English](README.md)

Simuler des logs dans votre terminal

## Prérequis:

- [Node.js](https://nodejs.org/fr) (v18 recommendé mais v16+ devrait fonctionner)
- [Git](https://git-scm.com/)
- Un terminal

## Installation:

Cloner le repo et aller dedans:

```sh
git clone https://github.com/Mimexe/logsimulator.git
cd logsimulator
```

## Utilisation

En premier lieu, lancez le serveur:

```sh
node index.js
```

Ou lancer le run.bat (pour windows) ou run.sh (pour linux)

Ensuite, le client démarrera automatiquement et surveillera le changement de fichier `logs.json` à mettre à jour.
Dans le serveur, vous pouvez ajouter des journaux en tapant simplement dans le terminal et en appuyant sur Entrée.
Pour quitter le serveur, tapez `/exit` et appuyez sur Entrée ou appuyez simplement sur CTRL + C.
Le client se fermera automatiquement lorsque le serveur sera fermé (gracieusement).
Vous pouvez effacer le terminal client avec la commande `/clear`.
Pour démarrer le serveur sans démarrer le client, utilisez le flag `--no-client`:

```sh
node index.js --no-client
```

Pour démarrer le client seul utilisez l'argument `client`:

```sh
node index.js client
```

Note: Vous avez besoin d'un fichier `logs.json` pour faire fonctionner le client. (sans démarrer le serveur)

## Commandes

- `/exit`: Quitter le serveur et le client
- `/clear`: Vider le terminal du client
- `/help`: Afficher le message d'aide
- `/title <title>`: Changer le titre du client

## Dépannage

### Le client ne démarre pas avec l'erreur 'No logs.json file found, exiting...'

Vous avez besoin d'un fichier `logs.json` pour faire fonctionner le client.
Vous pouvez en créer un en exécutant le serveur.
Ou vous pouvez en créer un manuellement avec ce contenu :

```json
[]
```

## License

[License MIT](LICENSE)
