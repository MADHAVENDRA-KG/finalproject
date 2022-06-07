"use strict";
var fs = require("fs");
const path = require("path");
const request = require("request");
let subscriptionKey = "18865737df6c4aa9a7a914578651ad46";
let endpoint = "https://gothack76.cognitiveservices.azure.com/";

var uriBase = endpoint + "vision/v3.1/analyze";
const { Console } = require("console");
const util = require("util");
const exec = util.promisify(require("child_process").exec); //powershell command exec krta hai node ke andar
var prompt = require("prompt-sync")();

const option = parseInt(
  prompt(
    "1. Create New Storage Account || 2. Create a container || 3. Upload Blob to container || 4. List the items in container || 0 For exit   "
  )
);

switch (option) {
  case 1:
    var storage = prompt("Enter Storage name : ");
    async function test() {
      const { error, stdout, stderr } = await exec(
        'New-AzStorageAccount -ResourceGroupName "startkarm" -Name "' +
          storage +
          '" -Location "eastus" -SkuName "Standard_RAGRS" -Kind "StorageV2"',
        { shell: "powershell.exe" }
      );
      if (stderr) {
        return { error: stderr };
      }
      return { data: stdout };
    }

    test()
      .then((x) => {
        console.log("Storage created");
      })
      .catch((err) => {
        console.log(err.stderr);
      });
    break;

  case 2:
    var storage = prompt("Enter Storage name : ");
    var con = prompt("Enter Container Name : ");
    async function test1() {
      const { error, stdout, stderr } = await exec(
        '$StorageAccount = Get-AzStorageAccount -ResourceGroupName "startkarm" -Name "' +
          storage +
          '";$Context = $StorageAccount.Context;New-AzStorageContainer -Name ' +
          con +
          " -Context $Context -Permission Blob",
        { shell: "powershell.exe" }
      );
      if (stderr) {
        return { error: stderr };
      }
      return { data: stdout };
    }

    test1()
      .then((x) => {
        console.log("Container Created");
      })
      .catch((err) => {
        console.log(err.stderr);
      });
    break;

  case 3:
    var storage = prompt("Enter Storage name : ");
    var file = prompt("Enter file path : ");
    var cont = prompt("Enter Container name : ");
    var fname = prompt("Enter file name : ");
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(file)) {
      console.log("Invalid File Extension");
    } else {
      //   const imageUrl =
      //     "https://hotnudephoto.com/wp-content/uploads/2021/09/1631085873_519_51-Great-boob-pics-sexy-desi-nude-girls.jpg";
      const imageUrl = file;
      const params = {
        visualFeatures:
          "Categories,Adult,Objects,Brands,Faces,Description,Color",
        details: "",
        language: "en",
      };

      const options = {
        uri: uriBase,
        qs: params,
        body: '{"url": ' + '"' + imageUrl + '"}',
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
      };
      var result = "";
      async function f() {
        let promise = new Promise((resolve, reject) => {
          request.post(options, (error, response, body) => {
            if (error) {
              console.log("Error: ", error);
              reject("Error");
            }
            var a = JSON.stringify(JSON.parse(body), null, "  ");
            resolve(a);
            //   console.log("JSON Response\n");
            //   console.log(jsonResponse);
          });
        });
        result = await promise;
        var t = JSON.parse(result);
        fs.writeFileSync("abc.txt", JSON.stringify(t));
        // console.log(t);
        if (
          t["adult"].isAdultContent == true ||
          t["adult"].isRacyContent == true ||
          t["adult"].isGoryContent == true
        ) {
          console.log("Adult content bro!!");
        } else {
          async function test2() {
            var download = function (uri, filename, callback) {
              request.head(uri, function (err, res, body) {
                console.log("content-type:", res.headers["content-type"]);
                console.log("content-length:", res.headers["content-length"]);

                request(uri)
                  .pipe(fs.createWriteStream(filename))
                  .on("close", callback);
              });
            };
            download(file, "google.png", function () {
              console.log("done");
            });

            const imagepath = path.join(__dirname, "/google.png");

            const { error, stdout, stderr } = await exec(
              '$StorageAccount = Get-AzStorageAccount -ResourceGroupName "startkarm" -Name "' +
                storage +
                '";$Context = $StorageAccount.Context;$Blob1HT = @{File = "' +
                imagepath +
                '" ; Container= "' +
                cont +
                '";Blob= "' +
                fname +
                '"; Context= $Context};Set-AzStorageBlobContent @Blob1HT',
              { shell: "powershell.exe" }
            );
            if (stderr) {
              return { error: stderr };
            }
            return { data: stdout };
          }
          test2()
            .then((x) => {
              console.log("File Uploaded");
              async function test2() {
                const { error, stdout, stderr } = await exec(
                  '$StorageAccount = Get-AzStorageAccount -ResourceGroupName "startkarm" -Name "' +
                    storage +
                    '";$Context = $StorageAccount.Context;$Blob2HT = @{File = "C:/Users/madhv/Desktop/azure-blob-js-browser/abc.txt" ; Container= "' +
                    cont +
                    '";Blob= "' +
                    fname +
                    '.txt"; Context= $Context};Set-AzStorageBlobContent @Blob2HT',
                  { shell: "powershell.exe" }
                );
                if (stderr) {
                  return { error: stderr };
                }
                return { data: stdout };
              }
              test2()
                .then((x) => {
                  console.log("File Uploaded");
                })
                .catch((err) => {
                  console.log(err.stderr);
                });
            })
            .catch((err) => {
              console.log(err.stderr);
            });
        }
        // console.log(t["adult"]);
      }
      f();
    }
    break;

  case 4:
    var storage = prompt("Enter Storage name : ");
    var con = prompt("Enter Container Name : ");
    async function test3() {
      const { error, stdout, stderr } = await exec(
        '$StorageAccount = Get-AzStorageAccount -ResourceGroupName "startkarm" -Name "' +
          storage +
          '";$Context = $StorageAccount.Context;Get-AzStorageBlob -Container "' +
          con +
          '" -Context $Context ',
        { shell: "powershell.exe" }
      );
      if (stderr) {
        return { error: stderr };
      }
      return { data: stdout };
    }

    test3()
      .then((x) => {
        console.log(x);
      })
      .catch((err) => {
        console.log(err.stderr);
      });
    break;

  default:
    console.log("Enter Valid Option");
}
