### Major Development Challenges and how I resolved them:

1. Handling Duplicate Tokens with SocketIO
- Issue: The client side experienced issues with SocketIO catching duplicate tokens during transmission.
- Resolution: TEMPORARY FIX - React.StrictMode was causing setState to fire twice, removing that solved it.
    Find more on this here: https://github.com/facebook/react/issues/12856

### Hosting
1. Using my free Azure Student account I created a fresh Linux Virtual Machine and set up node, python, nginx, certbot, etc on it.
    - I could also have used Azure App Service for this (would've made my work a whole lot easier!) but under my plan the website will only be available for 1hr/day. Hence I decided to setup everything on my own, since this also demonstrates my ability to host websites in-house using our own servers.
    - Only 1GB RAM is provided under this tier of Azure, which although is sufficient if the traffic on the website is quite low, but to be on a safer side I also created a swap partition of 15GB.
2. Tested if nginx is properly set up by hosting a simple html file on /helloworld.

