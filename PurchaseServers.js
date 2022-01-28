/** @param {NS} ns **/
export async function main(ns) {
    //The purpose of this script is to combine my delete.script and PurchaseServers.js into one package that will delete all servers when the server limit is at capacity, as well as print any 
    //errors when attempitng to purchase servers (if the server size returns infinity or is the same size as the current servers). 
    
        //Variable for ram size, using Math.pow(2, 10) to multiply into terabytes with 2^10. Remove Math.pow(2,10) for gigabytes.
        var ram = ("1024" * Math.pow(2, 10));
        //Variable for delete loop.
        var e = 0;
        //Variable for server length.
        var a = getPurchasedServers.length();
        //This while loop checks to see if there are any available servers to purchase; if the limit is reached this will tprint "Server Limit Reached,"" and continue to the next if statements.
        //If the 'var ram' is greater than the ns.getPurchasedServerMaxRam() then it will delete all servers and proceed to the purchase loop once complete. 
        while (e == ns.getPurchasedServerLimit() && (e !== 25) && (a !== 0) ) {
            ns.tprint("Server Limit Reached.");
            //If 'var ram' is equal to or less than the current servers' ram this prints an error message and kills the script.
            if (ns.getPurchasedServerMaxRam() >= ram){
                ns.tprint("Exsisting Server's RAM size larger than what's specified in the script")
                ns.tprint("Adjust RAM size.")
                ns.tprint("Killing Script Now")
                ns.kill("PurchaseServers.js", "home");
            }
            //Delete Loop.
            //If 'var ram' is greater than the current servers' ram, and the number of servers is equal to or less than the server limit of 25; deletes all servers until a == 0.
            //Should move onto the Purchase server while loop once a == 0.
            if ( (ns.getPurchasedServerMaxRam() < ram) && (a <= 25) && (a !== 0) && (e !== 25) && (ns.getPurchasedServerCost(ram) !== Number.POSITIVE_INFINITY) ){
                ns.tprint("Deleting Servers");
                ns.killall("pserv-" + e);
                ns.deleteServer("pserv-" + e);
                ns.tprint("Deleted pserv-" + e + " Successfully");
                ++e
            }
        }
        //Variable for purchase loop.
        var i = 0
        //While loop that purchases servers until the limit is reached (25 server limit) and if 'var a' = 0 (No purchased servers).
        while ( ( i < ns.getPurchasedServerLimit() ) && (a == 0) ) {
            //Only purchases servers if the home server can afford it, and if the ServerCost(ram) does not return infinity. 
            if ( (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram) * 25) && (ns.getPurchasedServerCost(ram) !== Number.POSITVE_INFINITY) ) {
                //This executes the purchase command, and names the server at the same time.
                ns.purchaseServer("pserv-" + i, ram);
                //This writes to the terminal.
                ns.tprint("Purchased " + "pserv-" + i + " Successfully!");
                //++i adds 1 to the variable "i" when the loop is completed. This is what ends the loop when the server limit is reached.
                await ns.sleep(1000)
                ++i
            }
            else if (ns.getServerMoneyAvailable("home") < ns.getPurchasedServerCost(ram) * 25) {
                //1. Returns error code if ServerCost(ram) === Infinity
                if (ns.getPurchasedServerCost(ram) === Number.POSITVE_INFINITY) {
                    ns.tprint("Server Size Error, cost = infinity!")
                    ns.tprint("Adjust ram size. Killing script now")
                    ns.kill("PurchaseServers.js", "home");
                }
                //2. Will print the money needed to complete a full purchase.
                if (ns.getPurchasedServerCost(ram) !== Number.POSITVE_INFINITY) {
                    ns.tprint("Need " + ((ns.getPurchasedServerCost(ram) * 25) - ns.getServerMoneyAvailable("home")) + " To Purchase All Servers.")
                    ns.tprint("Try running dontp00rman.script!");
                }
                ns.tprint("Trying again in 1 minute.")
                await ns.sleep(60000)
            }
        }
}
    //Did I do this right? "++i" won't add to "var i" until a server is purchased.
    //If the serverCost(ram) = Infinity, an error code will be printed. 
    //When there is not enough money to purchase servers, the script will wait 60 seconds before attempting to compare the cost of 25 servers with the available money.
