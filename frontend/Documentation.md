## Major Development Challenges and how I resolved them:

1. Handling Duplicate Tokens with SocketIO
- Issue: The client side experienced issues with SocketIO catching duplicate tokens during transmission.
- Resolution: 

2. Content Overlap Across Multiple Tabs
- Issue: When the website was opened in multiple tabs, each tab received content meant for the others (due to sockets broadcasting the contents).
- Resolution: Implemented a load balancer which assigns each opened instance of the website a UUID and maintains a queue of requests from all sockets to be handed over to the processes running on port 5001 (gemini) and 5002 (emotion bot) 

    Note: A better way would've been using Redis queues for this, should be definitely implemented at enterprise level!