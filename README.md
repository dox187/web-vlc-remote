# VLC


## Intro

My personal WebUI for VLC Media Player.

Incompatible with IE and Firefox. Tested in Chrome, Safari and Mobile Safari.

## Screenshots

![Controls](https://github.com/eldwin/web-vlc-remote/raw/gh-pages/1.png)
![Playlist](https://github.com/eldwin/web-vlc-remote/raw/gh-pages/2.png)
![Browser](https://github.com/eldwin/web-vlc-remote/raw/gh-pages/3.png)
![Settings](https://github.com/eldwin/web-vlc-remote/raw/gh-pages/4.png)

## Usage

```sh
	bower install
```

http:
```sh
	sudo python -m SimpleHTTPServer 80
```

file:
```sh
	open index.html directly in browser
```

Navigate to the settings tab to configure remote VLC player to connect to.

### Method
GET - Use where same-origin policy can be bypassed e.g. WebView

JSONP - Requires modifications to VLC lua scripts to support json callback. Save and restart VLC.

status.json, browse.json & playlist.json:
```sh
if _GET['callback'] == nil then
	httprequests.printTableAsJson(<?>)
else
	print(_GET['callback'] .. '(')
	httprequests.printTableAsJson(<?>)
	print(')')
end
```

## Credits

[Lungo](http://lungo.tapquo.com) for heavy lifting the UI components.

[AngularJS](https://angularjs.org) for writing most of the code for me.

[Bower](http://bower.io) for the cutest bird ever and awesome package manager which comes as a bonus.

[ngStorage](https://github.com/gsklee/ngStorage) for the slick integration of localStorage into AngularJS.

[VLC Remote](http://hobbyistsoftware.com/vlc-more) for the source of inspiration. Was using this great application until I decided to build a web version which works on all my devices.

