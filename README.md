#Phaser-db5-Seed

This project is an application skeleton for a typical [phaser.js](http://phaser.io) game.  You can use it to quickly test, build and deploy your phaser projects.

Based off of [phaser-bootstrap](https://github.com/rantt/phaser-bootstrap) with the exception of using [Gulp.js](http://gulpjs.com/) instead of [Grunt.js](http://gruntjs.com/).

It includes a basic splash screen, loading bar and instruction panel.

##Getting Started

	npm install gulp -g
	npm install
	gulp init

This will download and install the necessary files to get started.

## Running With Scissors

Now you can just run 

	gulp

This will start a task that will watch for changes to files in the "src" directory.  When they are updated the webserver will automatically reload and jshint will get run, letting you know if there are any linting issues that need resolved.

## Packaging For Deployment

	gulp build

This will package up your game in the dist directory for deployment.

## Testing Dist

You can test the distribution package before deployment by running `gulp dist-server` to fire up a webserver from the "dist" folder.

## Deploying Your Project

Edit *rsync-config.json*

	{
	  "rsync": {
	    "username": "yourusername",
	    "hostname": "yourdomain",
	    "destination": "/path/on/server/"
	  }
	}

Change these settings to reflect your servers settings. Then run

	gulp deploy
	
to upload the game files to your server.

## List Of Gulp Tasks

### gulp *default*

Watches for changes to files in the "src" directory and updates the webserver and runs linting tools on the files with they are changed.

### gulp dev-server
Starts a browser loading content from the *src* directory

### gulp dist-server
Starts a server loading content from the *dist* directory.  Assuming it's been built already.

### gulp init
Downloads phaser.min.js, phaser.map and phaser-debug.js to the `src/js/lib` directory.

### gulp get-phaser
Downloads phaser.min.js and phaser.map to the `src/js/lib` directory.

### gulp get-debug
Downloads phaser-debug.js to the `src/js/lib` directory

### gulp clean
Clears all files out of the "dist" direcotry

### gulp copy
Copies the files/structure in the `src/assets` directory with the exception of images and javascript.

### gulp imagemin
Copies and compresses the png's in the `src/assets/images/` direcotyr

### gulp build
Runs clean, copy and imagemin.  It aslo uses usemin to concatenate and minify the HTML, JS and CSS in the "src" directory and place it in the "dist" directory

### gulp lint
Runs jshint on the files in `src/js/*.js`

### gulp watch
Watches `src/js/*.js` and `src/index.html` and runs the lint task when these files are changed.

### gulp deploy
Rsyncs the files in the dist directory to a remote server specified in the `rsync-config.json` file.
