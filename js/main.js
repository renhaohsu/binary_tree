// 視覺化
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = window.innerWidth;
var height = window.innerHeight;


canvas.width = 0.95 * width ;
canvas.height = 0.77 * height;

ctx.font = "30px Arial";

function drawBackground() {
	ctx.beginPath();
	ctx.rect(0, 0, width, height);
	ctx.fillStyle = "#aaa"
	ctx.fill();
	ctx.closePath();
}
// 輸出tree.traverse之後排列好的順序到底下
var p_tag = document.getElementsByTagName('p')

//建一棵樹
class Tree {
	constructor() {
		this.root = null;  //根節點 現在裡面沒東西
	}

	addValue(val) {  // 有新的東西要放時 檢查root
		var n = new Node(val);
  		if (this.root == null) {  // 是空的 就直接放這
  			this.root = n;  // n是個node 這樣就能讓root有node的功能 只是名字叫做root
  			this.root.x = canvas.width / 2 - 15;
  			this.root.y = 40;
			this.root.whichFloor = 0;
  		} else {  // 已經有root了 那在root底下新增子節點
  			this.root.addNode(n)
  		}
	}

	traverse() {
		this.root.visit(this.root);
	}

	search(val) {
		var result = this.root.search(val);
		return result;
	}
}


//建立樹的節點
class Node {
	constructor(val, x, y){
		this.value = val;
		this.left = null;
		this.right = null;
		this.x = x;  // 視覺化用的 
		this.y = y;  // 視覺化用的
		this.distance = 2;
	}

	addNode(n) {  // 在這個node底下增加新的子節點 小的放左 大的放右
		if (n.value < this.value) {
			if (this.left == null) {
				this.left = n;
				this.left.x = this.x - (canvas.width /(n.distance * n.distance));
				this.left.y = this.y + 40;
				this.whichFloor ++;
			} else {  //如果節點已經有左子節點 那就讓左子節點來往下加子節點
			    n.distance++;
				this.left.addNode(n);
			}
		} else if (n.value > this.value) {
			if (this.right == null) {
				this.right = n;
				this.right.x = this.x + (canvas.width /(n.distance * n.distance));
				this.right.y = this.y + 40;
				this.whichFloor ++;
			} else {
		    	n.distance++;
				this.right.addNode(n);
			}
		}
	}

	visit(parent) {  //往左找有就往下 沒有就印出自己 然後往右找有就往下 沒有就回到上一層(但因為這樣寫所以程式碼不用打出來 太神奇了)
		if (this.left != null) {
			this.left.visit(this);
		}
		console.log(this.value)

		ctx.strokeText(this.value,this.x,this.y);  // 寫出數字
		// ctx.setLineDash([5,5])  // 會出問題 不過現在懶得多想
		ctx.beginPath();  
		ctx.ellipse(this.x+15, this.y-15, 17, 17, 0, 0, 2 * Math.PI);
		ctx.moveTo(parent.x+15, parent.y-15);  // 移動畫筆 準備畫線
		ctx.lineTo(this.x+15,this.y-15);  // 畫直線到這
		ctx.stroke();  // 真的開始畫

		p_tag[1].innerText += '，' + this.value  // 加到html底下的文字方便觀察
		
		if (this.right != null) {
			this.right.visit(this);
		}
	}

	search(val) {  // return真好用 雖然全部拔掉(tree的也要)也能運作XD 一開始就是這樣寫的
		if (this.value == val) {
			console.log("找到" + this.value + "了 喏 給你看");
			return this;
		} else if (val < this.value && this.left != null) {
			console.log("讓我找下" + this.value + "左邊")
			return this.left.search(val);
		} else if (val > this.value && this.right != null) {
			console.log("讓我找下" + this.value + "右邊")
			return this.right.search(val);
		}
		return console.log("找不到")
	}

}


var tree = new Tree;

// tree.addValue(5);

// tree.addValue(3);
// tree.addValue(7);
// tree.addValue(6);
//現在長這樣
// root 5
//    3   7
//       6


for (var i = 0; i < 10; i++) {
	tree.addValue(Math.floor(100 * Math.random(0, 1)))
}
console.log(tree);

drawBackground()
tree.traverse();


//新增節點到樹上   ((為何別人的作業都寫得這麼好 真厲害
function add() {
	if (document.getElementsByTagName('input')[0].value != "") {
		tree.addValue(document.getElementsByTagName('input')[0].value);
        
        p_tag[1].innerText = '來排列一下好了';  // 清掉排好的數字們
    	ctx.clearRect(0, 0, canvas.width, canvas.height);  // 清除畫布
    	drawBackground();  // 重畫畫布
        tree.traverse();
        document.getElementsByTagName('input')[0].value = "";
	}
}