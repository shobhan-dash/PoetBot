### Major Development Challenges and how I resolved them:

1. Handling Duplicate Tokens with SocketIO
- Issue: The client side experienced issues with SocketIO catching duplicate tokens during transmission.
- Resolution: 

2. Content Overlap Across Multiple Tabs
- Issue: When the website was opened in multiple tabs, each tab received content meant for the others (due to sockets broadcasting the contents).
- Resolution: Implemented a load balancer which assigns each opened instance of the website a UUID and maintains a queue of requests from all sockets to be handed over to the processes running on port 5001 (gemini) and 5002 (emotion bot) 

    Note: A better way would've been using Redis queues for this, should be definitely implemented at enterprise level!


### Hosting
1. Using my free Azure Student account I created a fresh Linux Virtual Machine and set up node, python, nginx, certbot, etc on it.
    - I could also have used Azure App Service for this (would've made my work a whole lot easier!) but under my plan the website will only be available for 1hr/day. Hence I decided to setup everything on my own, since this also demonstrates my ability to host websites in-house using our own servers.
    - Only 1GB RAM is provided under this tier of Azure, which although is sufficient if the traffic on the website is quite low, but to be on a safer side I also created a swap partition of 15GB.
2. Tested if nginx is properly set up by hosting a simple html file on /helloworld.

