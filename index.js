var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var storage = multer.diskStorage({
	filename: function(req,file,callback){
		callback(null,file.originalname)
	},
	destination: function(req,file,callback){
		callback(null,'./views/uploads')
	}
})
var upload = multer({storage:storage})
const {exec} = require('child_process')
var app = express()

//app.use(bodyParser.urlencoded({extended:true}))

function cmd(str){
	exec(str,function(err,stdout,stderr){
		if(err){
			return err
		}
		else if(stdout){
			return stdout
		}
		else if (stderr){
			return stderr
		}
		else{
			return true
		}
	})
}

//cmd("sudo mv views/uploads/19fbc82d50415a767869284ed562313f" + " test%2500.jpg")

app.use(express.static('./views/'))


app.get("/",function(req,res){
	res.render("index.ejs")
})

app.post("/upload",upload.single('image'),function(req,res){
	original_name = req.file.originalname
	console.log(original_name)
	if(original_name.split('.').length <= 2 && original_name.split('.')[1].includes('png')){
		res.send("<script>alert('Uploaded!');window.location.href='/'</script>")
		//console.log(original_name)
		console.log(req.file.filename)
		//console.log(cmd("sudo mv views/uploads/"+req.file.filename + " ./views/uploads/" + original_name))
		return true
	}
	res.send("<script>alert('Try again');window.location.href='/'</script>")
	exec('sudo rm -r views/uploads/'+req.file.filename, function(err,stdout,stderr){
		if(stdout){
			console.log('[+] Failed to bypass')
		}
		else if (err){
			console.log(err)
		}
		else{
			console.log(stderr)
		}
	})
})

app.listen(80,function(){
	console.log("[+] SERVER HAS BEEN STARTED")
})
