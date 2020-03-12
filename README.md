<h1 style = 'border-bottom: 0px'>
  CHESSSUP
</h1>

Real-time Online Chess Game. you can play here <https://chesssup.com>

----

## Table of contents

[● Technical Stack](#Technial-Stack)  
[● Service Overview](#Service-Overview)  
[● Service Contents](#Contents)  
[● Upcoming Work](#Upcoming-Work)  

----

## Technical Stack

* Backend
  * Node.js
  * Express
  * Session-based authentication
    * Express-Session
  * SocketIO
  * Nginx
  * MongoDB
    * Mongoose
  * AWS EC2

* Frontend
  * Single Page Application (SPA)
  * React.js
  * Redux
    * Thunk
    * Saga

----

## Service Overview

* How this service works
  * How to update View
    * All requests from client side are made through http call
    * All response from server side are made through SocketIo
    * This allows multiple gameplay from multiple tabs in the browser
    * The authentication is shared among the tabs of the browser, but the service is provided individually for each tab
  * Optimization
    * To conserve network bandwidth, socketio's namespace area is divided on every page
    * When updating the chessboard, Only the movement of the piece is transferred to the network
    * By not receiving the entire board, you can partially update the view and minimize the reconciliation of React
* Game Rules
  * Process
    * Currently, the service only supports multiplayer. Therefore, at least two players are required to play the game
    * The game has a default time and a recharge time that is filled when you turn over
    * In-game users are divided into players (black and white) and spectators
    * You can play chess only during your turn, and spectators can only watch and chat
  * Algorithm
    * Game rules are driven by algorithms that i create
    * All movement of chess such as check, checkmate, stalemate, promotion, etc. are provided
    * All logic related to winning or failing will be reflected in the record after it is finally approved by the server
* Functions
  * Utility
    * It is possible to flip the chess board (At first, the chess piece you grab is facing down)
    * Request for surrender, request to draw, or request to roll back is now available
  * Replay
    * Redo, Undo, FastRedo, FastUndo is now available
    * It is also possible to view a specific board state in replay mode by pressing a notation
* ETC
  * Main Page
    * You can check the ranking page in real time, and you can see recently played games next to it
  * Community Page
    * It is designed as a REST API and is a community in the form of a basic bulletin board

----

## Service Contents

...

-----


## Upcoming Work

* Limitation
  * Multi-process is not supported
  * Single play is not supported
  * Personalization still has many features to complement
* About upcoming Ver2
  * Multi-process and auto scaling will be supported by redis, socket.io-redis
  * Single play will be supported by stockfishchess bot engine (<https://stockfishchess.org>)
  * Personal record archieve and replay features will be added

----