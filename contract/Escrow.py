# import smartpy as sp

# class Escrow(sp.Contract):
#     def __init__(self, owner, fromOwner, counterparty, fromCounterparty, epoch, hashedSecret, admin):
#         self.init(fromOwner           = fromOwner,           #initial deposit (sp.tez)
#                   fromCounterparty    = fromCounterparty,    #amount contributed by the counterparty (tez)
#                   balanceOwner        = sp.tez(0),           #
#                   balanceCounterparty = sp.tez(0),           #
#                   hashedSecret        = hashedSecret,        #has of the secret that the counterparty must provide to release funds (Bytes)
#                   epoch               = epoch,               #
#                   owner               = owner,               #address of owner
#                   counterparty        = counterparty,        #address of counterparty
#                   admin               = admin,               #address of the admin
#                   )

#     # Adds funds to the contract from the owner's account
#     @sp.entry_point
#     def addBalanceOwner(self):
#         #if the owner's balance hasn't been added yet and the amount send is equal to the deposit
#         sp.verify(self.data.balanceOwner == sp.tez(0), "DEPOSITED ALREADY")
#         sp.verify(sp.amount == self.data.fromOwner, "DEPOSITED TOO MUCH OR TOO LITTLE")

#         #change the deposited balance in the contract to the amount sent (because it's just equal)
#         self.data.balanceOwner = self.data.fromOwner

#     # adds the balance counterparty
#     @sp.entry_point
#     def addBalanceCounterparty(self):
#         #if the counterparty's balance hasn't been added yet and the amount sent is equal to the amount needed to be sent by the counterparty
#         sp.verify(self.data.balanceCounterparty == sp.tez(0), "DEPOSITED ALREADY")
#         sp.verify(sp.amount == self.data.fromCounterparty, "DEPOSITED TOO MUCH OR TOO LITTLE")

#         #change the balance deposited by the counterparty in the contract to the amount sent
#         self.data.balanceCounterparty = self.data.fromCounterparty

#     #function for the owner and counterparty to claim all of the funds
#     def claim(self, identity):
#         #identity is the user who wants to execute the claim function
#         sp.verify(sp.sender == identity, "UNAUTHORIZED SENDER")

#         #sends the total of the balance of the owner and counterparty to the indentity
#         sp.send(identity, self.data.balanceOwner + self.data.balanceCounterparty)
        
#         #resets the balances
#         self.data.balanceOwner = sp.tez(0)
#         self.data.balanceCounterparty = sp.tez(0)

#     #for the counterparty to claim the funds
#     @sp.entry_point
#     def claimCounterparty(self, params):

#         #checks if the timestamp is within the epoch and that the hashed secret is correct
#         sp.verify(sp.now < self.data.epoch, "EXPIRED")
#         sp.verify(self.data.hashedSecret == sp.blake2b(params.secret), "WRONG SECRET")

#         #uses the claim entry_point to claim the funds
#         self.claim(self.data.counterparty)

#     @sp.entry_point
#     def claimOwner(self):

#         #checks if the epoch is lower than now
#         sp.verify(self.data.epoch < sp.now)

#         #uses the claim entry_point to claim the funds
#         self.claim(self.data.owner)
    
    
#     # for the admin to revert the funds if both parties widthdraw
#     @sp.entry_point
#     def revert(self, params):

#         #checks if the sender is the admin
#         sp.verify(sp.sender == self.data.admin, "NOT AUTHORIZED")
#         sp.verify(params.counterpartyWidthdraw == True, "COUNTERPARTY DID NOT AGREE")
#         sp.verify(params.ownerWidthdraw == True, "OWNER DID NOT AGREE")
#         sp.verify(self.data.balanceOwner + self.data.balanceCounterparty > sp.tez(0), "NO BALANCE IN ESCROW")

#         #return the balances
#         sp.send(self.data.owner, self.data.balanceOwner) 
#         sp.send(self.data.counterparty, self.data.balanceCounterparty)

#         #reset the balances
#         self.data.balanceOwner = sp.tez(0)
#         self.data.balanceCounterparty = sp.tez(0)

# @sp.add_test(name = "Escrow")
# def test():
#     scenario = sp.test_scenario()
#     scenario.h1("Escrow")

#     #defining the parameters
#     hashSecret = sp.blake2b(sp.bytes("0x01223344"))
#     owner = sp.test_account("Owner")
#     counterparty = sp.test_account("Counterparty")
#     admin = sp.test_account("Admin")
#     fromOwner = sp.tez(50)
#     fromCounterparty = sp.tez(4)
#     epoch = sp.timestamp(123)
    
#     c1 = Escrow(owner.address, fromOwner, counterparty.address, fromCounterparty, epoch, hashSecret, admin.address)

#     scenario += c1
    
#     #failure test to add balance
#     scenario.h3("Deposit - Fail")
#     c1.addBalanceOwner().run(sender = owner, amount = sp.tez(30), valid = False)
    
#     scenario.h3("Deposit - Success")
#     c1.addBalanceOwner().run(sender = owner, amount = sp.tez(50))

#     scenario.h3("Deposit - Fail")
#     c1.addBalanceCounterparty().run(sender = counterparty, amount = sp.tez(5), valid = False)

#     scenario.h3("Deposit - Success")
#     c1.addBalanceCounterparty().run(sender = counterparty, amount = sp.tez(4))

#     scenario.h3("Deposit - Fail")
#     c1.addBalanceCounterparty().run(sender = counterparty, amount = sp.tez(4), valid = False)
    
#     scenario.h3("Erronous secret")
#     c1.claimCounterparty(secret = sp.bytes("0x01223343")).run(sender = counterparty, valid = False)
    
#     scenario.h3("Correct secret")
#     c1.claimCounterparty(secret = sp.bytes("0x01223344")).run(sender = counterparty)
    
#     #success test to add balance
#     scenario.h3("Deposit - Success")
#     c1.addBalanceOwner().run(sender = owner, amount = sp.tez(50))
#     c1.addBalanceCounterparty().run(sender = counterparty, amount = sp.tez(4))

#     scenario.h3("Revert - Fail")
#     c1.revert(counterpartyWidthdraw = True, ownerWidthdraw = True).run(sender = owner, valid = False)
#     c1.revert(counterpartyWidthdraw = False, ownerWidthdraw = False).run(sender = admin, valid = False)
#     c1.revert(counterpartyWidthdraw = False, ownerWidthdraw = True).run(sender = admin, valid = False)
#     c1.revert(counterpartyWidthdraw = True, ownerWidthdraw = False).run(sender = admin, valid = False)

#     scenario.h3("Revert - Success")
#     c1.revert(counterpartyWidthdraw = True, ownerWidthdraw = True).run(sender = admin)


# sp.add_compilation_target("escrow", Escrow(sp.address("tz1YQreoL3HXshDUxzZScsfcexK9E4h6Np7p"), sp.tez(50), sp.address("tz1d9Nzx3m2YBrTRuXKjaw5uwMdV2jsa7UDw"), sp.tez(4), sp.timestamp(123), sp.bytes("0xc2e588e23a6c8b8192da64af45b7b603ac420aefd57cc1570682350154e9c04e"), sp.address("tz1eWNVFay3mnsPj4evRMrJeUiSs17HLMe7a")))

# START HERE

import smartpy as sp

class Escrow(sp.Contract):
    def __init__(self, owner, fromOwner, counterparty, fromCounterparty, epoch, hashedSecret, admin):
        self.init(fromOwner           = fromOwner,           #initial deposit (sp.tez)
                  fromCounterparty    = fromCounterparty,    #amount contributed by the counterparty (tez)
                  balanceOwner        = sp.tez(0),           #
                  balanceCounterparty = sp.tez(0),           #
                  hashedSecret        = hashedSecret,        #has of the secret that the counterparty must provide to release funds (Bytes)
                  epoch               = epoch,               #
                  owner               = owner,               #address of owner
                  counterparty        = counterparty,        #address of counterparty
                  admin               = admin,               #address of the admin
                  )

    # Adds funds to the contract from the owner's account
    @sp.entry_point
    def addBalanceOwner(self):
        #if the owner's balance hasn't been added yet and the amount send is equal to the deposit
        sp.verify(self.data.balanceOwner == sp.tez(0), "DEPOSITED ALREADY")
        sp.verify(sp.amount == self.data.fromOwner, "DEPOSITED TOO MUCH OR TOO LITTLE")

        #change the deposited balance in the contract to the amount sent (because it's just equal)
        self.data.balanceOwner = self.data.fromOwner

    # adds the balance counterparty
    @sp.entry_point
    def addBalanceCounterparty(self):
        #if the counterparty's balance hasn't been added yet and the amount sent is equal to the amount needed to be sent by the counterparty
        sp.verify(self.data.balanceCounterparty == sp.tez(0), "DEPOSITED ALREADY")
        sp.verify(sp.amount == self.data.fromCounterparty, "DEPOSITED TOO MUCH OR TOO LITTLE")

        #change the balance deposited by the counterparty in the contract to the amount sent
        self.data.balanceCounterparty = self.data.fromCounterparty

    #function for the owner and counterparty to claim all of the funds
    def claim(self, identity):
        #identity is the user who wants to execute the claim function
        sp.verify(sp.sender == identity, "UNAUTHORIZED SENDER")

        #sends the total of the balance of the owner and counterparty to the indentity
        sp.send(identity, self.data.balanceOwner + self.data.balanceCounterparty)
        
        #resets the balances
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)

    #for the counterparty to claim the funds
    @sp.entry_point
    def claimCounterparty(self, params):

        #checks if the timestamp is within the epoch and that the hashed secret is correct
        sp.verify(sp.now < self.data.epoch, "EXPIRED")
        sp.verify(self.data.hashedSecret == sp.blake2b(params.secret), "WRONG SECRET")

        #uses the claim entry_point to claim the funds
        self.claim(self.data.counterparty)

    @sp.entry_point
    def claimOwner(self):

        #checks if the epoch is lower than now
        sp.verify(self.data.epoch < sp.now)

        #uses the claim entry_point to claim the funds
        self.claim(self.data.owner)
    
    
    # for the admin to revert the funds if both parties widthdraw
    @sp.entry_point
    def revert(self, params):

        #checks if the sender is the admin
        sp.verify(sp.sender == self.data.admin, "NOT AUTHORIZED")
        sp.verify(params.counterpartyWidthdraw == True, "COUNTERPARTY DID NOT AGREE")
        sp.verify(params.ownerWidthdraw == True, "OWNER DID NOT AGREE")
        sp.verify(self.data.balanceOwner + self.data.balanceCounterparty > sp.tez(0), "NO BALANCE IN ESCROW")

        #return the balances
        sp.send(self.data.owner, self.data.balanceOwner) 
        sp.send(self.data.counterparty, self.data.balanceCounterparty)

        #reset the balances
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)

@sp.add_test(name = "Escrow")
def test():
    scenario = sp.test_scenario()
    scenario.h1("Escrow")

    contract = Escrow(sp.address("tz1YQreoL3HXshDUxzZScsfcexK9E4h6Np7p"), sp.tez(50), sp.address("tz1d9Nzx3m2YBrTRuXKjaw5uwMdV2jsa7UDw"), sp.tez(4), sp.timestamp(123), sp.bytes("0xc2e588e23a6c8b8192da64af45b7b603ac420aefd57cc1570682350154e9c04e"), sp.address("tz1eWNVFay3mnsPj4evRMrJeUiSs17HLMe7a"))


#     #defining the parameters
#     hashSecret = sp.blake2b(sp.bytes("0x01223344"))
#     owner = sp.test_account("Owner")
#     counterparty = sp.test_account("Counterparty")
#     admin = sp.test_account("Admin")
#     fromOwner = sp.tez(50)
#     fromCounterparty = sp.tez(4)
#     epoch = sp.timestamp(123)
    
#     c1 = Escrow(owner.address, fromOwner, counterparty.address, fromCounterparty, epoch, hashSecret, admin.address)

    scenario += contract
