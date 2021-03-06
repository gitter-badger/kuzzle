# How to contribute to Kuzzle

Here are a few rules and guidelines to follow if you want to contribute to Kuzzle and, more importantly, if you want to see your pull requests accepted by Kuzzle team.

## Coding style
We use most of the [NPM Coding Style](https://docs.npmjs.com/misc/coding-style) rules, except for these ones:

* Semicolons at the end of lines
* 'Comma first' rule is not followed

## Guidelines
* Use promises instead of callbacks as often as you can.
* If you add new functions, files or features to Kuzzle, then implements the corresponding unit and/or functional tests. We won't accept non-tested pull requests.
* [Documentation and comments are more important than code](http://queue.acm.org/detail.cfm?id=1053354): comment your code, use jsdoc for every new function, add or update markdown documentation if need be. We won't accept non-documented pull requests.
* Similar to the previous rule: documentation is important, but also is code readability. Write [self-describing code](https://en.wikipedia.org/wiki/Self-documenting).


## General rules and principles we'd like you to follow
* If you plan to add new features to Kuzzle, make sure that this is for a general improvement to benefit a majority of Kuzzle users. If not, consider making an add-on instead (like a new Kuzzle service for instance).
* Follow the [KISS Principle](https://en.wikipedia.org/wiki/KISS_principle)
* Follow [The Boy Scout Rule](http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule)

## Tools
For development only, we built a specific docker-compose file: `docker-compose/debug.yml`. You can use it to profile, debug, test a variable on the fly, add breakpoints and so on, thanks to [Node Inspector](https://github.com/node-inspector/node-inspector).  

Run the stack with:

```
docker-compose -f docker-compose-debug.yml up
```

You can now access to:

* http://localhost:7512/api for standard Kuzzle API
* http://127.0.0.1:8080/debug?port=7000 to debug the server
* http://127.0.0.1:8081/debug?port=7001 to debug the worker

**Note:** Because we have two different process for server and worker, you have to debug these two applications by accessing two URL (with port 8080 and port 8081).  
  
Every times a modification is detected by [PM2](https://github.com/Unitech/pm2), the server is restarted and the debugger page is automatically refreshed with the code up to date and with previous placed breakpoints.