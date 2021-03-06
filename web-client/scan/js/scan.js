var logged_in = false
QrScanner.WORKER_PATH = 'js/qr-scanner-worker.min.js'
var scanner

window.onload = function () {
	if (window.location.href.startsWith("http://"))
		window.location = window.location.href.replace("http://", "https://")

	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()

	setup_barcode_scanner()
	setup_qrcode_scanner()
}

function setup_qrcode_scanner() {
	scanner = new QrScanner($('#qrcode-scanner-container')[0], result => {
		window.location = `../inventory/item?id=${result}`
	})
	scanner.start()

	$('[data-bs-toggle="popover"]').popover({
		trigger: "focus",
		html: true,
		sanitize: false
	})
}

function setup_barcode_scanner() {
	Quagga.init({
		inputStream : {
			name : "Live",
			type : "LiveStream",
			constraints: {
				width: 640,
				height: 640,
			},
			target: $('#barcode-scanner-container')[0]
		},
		decoder : {
			readers : ["code_128_reader"]
		}
		}, function(err) {
			if (err) {
				console.log(err)
				return
		}
		Quagga.start()
	})

	Quagga.onDetected(data => {
		window.location = `../inventory/item?id=${data.codeResult.code}`
	})
}

function search() {
	var keyword = $(".search-form input").val()
	window.location = "../search/" + ((keyword == "") ? "" : "?search=" + encodeURIComponent(keyword))
	return false
}

function logout() {
	set_cookie("login_hash", "", 1)
	window.location.reload()
}

function hide_all_dialogs() {
	$(".dialog").css("visibility", "hidden")
	$("#dialog-container").css("visibility", "hidden")
}

function show_dialog(id) {
	$('#' + id).css("visibility", "visible")
	$("#dialog-container").css("visibility", "visible")
}
