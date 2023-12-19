const accountService = require("../services/AccountService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const account = req.body;
    let existAccount = await accountService.findAccountByEmail(account.email);
    if (existAccount == null) {
      bcrypt
        .hash(account.password, 10)
        .then((hashedPassword) => {
          const newAccount = {
            ...account,
            password: hashedPassword,
          };
          accountService.createAccount(newAccount).then((result) => {
            const { password: password, ...returnAccount } = result._doc;
            res.json({ data: returnAccount, status: "success" });
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    } else {
      res.status(409).json({ message: "Email has been used" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const account = req.body;
    accountService
      .findAccountByEmail(account.email)
      .then((result) => {
        const existAccount = result._doc;
        bcrypt
          .compare(account.password, existAccount.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              res.status(401).json({ message: "Account and password incorrect" });
            } else {
              const token = jwt.sign(
                {
                  accountId: existAccount._id,
                  accountEmail: existAccount.email,
                },
                accountService.secretKey,
                {
                  expiresIn: "24h",
                }
              );

              const { password: password, ...returnAccount } = existAccount;
              res.json({ data: { token, ...returnAccount }, status: "success" });
            }
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      })
      .catch(() => {
        res.status(401).json({ message: "Account and password incorrect" });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAccountById = async (req, res) => {
  try {
    if (req.params.id === req.account.accountId) {  
      const account = await accountService.getAccountById(req.params.id);
      const {password: password, ...returnData} = account._doc;
      res.json({ data: returnData, status: "success" });
    } else {
      res.json({ data: null, status: "success" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.updateAccount = async (req, res) => {
  try {
    if (req.params.id === req.account.accountId) {  
      const account = await accountService.updateAccount(req.params.id, req.body);
      const {password: password, ...returnData} = account._doc;
      res.json({ data: returnData, status: "success" });
    } else {
      res.json({ data: null, status: "success" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}