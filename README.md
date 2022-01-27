## Running the project
There is no need to run it locally, it's all deployed and running on this address: https://adoring-meitner-d55d1a.netlify.app/
The backend is running here, you can try out the backend endpoints if you like to (I didn't have time to set up Swagger :/) : https://solita-dev-academy.herokuapp.com/ 

*You can create an account and log in with it although it doesn't give you any privileges yet. I wanted to implement a system where a farm is attached to the admin user and only he/she can append new data. The other users would just get to view the data and not change it. But I ran out of time so no such cool features here..
* You can add additional farms through backend enpoints but currently there are 4 farms listed in the database which have no monitoring data so you have to add it yourself
* There are test CSV files in the Farm_data folder. None of them are too big to parse nor append to the database, but the tables and charts crash if there are a lot of data they need to wait for, so I suggest you try the files with the _TEST or something ending (200-1200 lines long). PartialTech's farm already has it's Test file appended, so you can view the results in the Analysis tab right away.
*You can then move to Analysis page where you can select a farm whose data you want to view. The rainfall, temperature and ph averages are calculated on the whole database, so all 4 farms. I wanted to make it so that it takes the ID of the farm that you
 selected and then calculates the average, but something got messed up with the endpoint.
