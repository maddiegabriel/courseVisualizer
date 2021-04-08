Nginx Server

How to access the server
    1. Connect to the school server by using VPN (Ex: Cisco off campus access)
    2. ssh with "sysadmin@cis4250-06.socs.uoguelph.ca"
    3. Password Czar********
    
How to Run the server
    1. Check the status of the server with "sudo systemctl status nginx"
    2. If it is inactive run "sude systemctl start nginx"
    3. Check the statis of the server it should say "Active"
    4. If not active try running kill command "sudo pkill -f nginx & wait $!" and return to 2.
    5. View the website at http://cis4250-06.socs.uoguelph.ca

How to edit the html
    1. Access the vm
    2. cd w21cis4150team6/src/html
    3. nano index.team6.html *Do not move this file as the server is checking for it in this specific location

How to edit the nginx conf gile
    1. cd /etc/nginx/conf.d
    2. nano team6.conf

    Currently the config file only has the location of the html file(root), 
    server name to use, and the name of the index (html file), and some basic
    error logging. 

    The server is running on port 80 and the file will be further editted in the future
    as the project progresses.