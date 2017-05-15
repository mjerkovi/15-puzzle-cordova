
var app = function() {

    var self = {};
    self.is_configured = false;

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        v.map(function(e) {e._idx = k++;});
    };

    // Initializes an attribute of an array of objects.
    var set_array_attribute = function (v, attr, x) {
        v.map(function (e) {e[attr] = x;});
    };

    self.initialize = function () {
        document.addEventListener('deviceready', self.ondeviceready, false);
    };

    self.ondeviceready = function () {
        // This callback is called once Cordova has finished
        // its own initialization.
        console.log("The device is ready");
        $("#vue-div").show(); // This is jQuery.
        self.is_configured = true;
    };

    self.reset = function () {
        self.vue.board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    };

    // If board[index] itself is the empty spot then return -1
    // If none of the neighbors of board[index] are the empty spot
    //      return -1
    // Otherwise return the index of the empty spot
    self.find_empty_neighbor = function (index) {
        if (index < 0 || index >= self.vue.board.length || self.vue.board[index] === 0) {
            return -1;
        }

        // There is something to the left of the tile
        // && short circuited so if index==0, wont be out of bounds indexing
        if ((index % 4 !== 0) && (self.vue.board[index - 1] === 0)) {
            return index - 1;
        }

        // There is something to the right of the tile
        if ((index % 4 !== 3) && (self.vue.board[index + 1] === 0)) {
            return index + 1;
        }

        // There is something above the tile
        if ((index > 3) && (self.vue.board[index - 4] === 0)) {
            return index - 4;
        }

        // There is something below the tile
        if ((index < 12) && (self.vue.board[index + 4] === 0)) {
            return index + 4;
        }
        return -1;

    };

    self.shuffle = function(i, j) {
        // You need to implement this.
        console.log("Shuffle:" + i + ", " + j);

        var empty = self.find_empty_neighbor(4*i+j);
        if (empty === -1) { return; }
        else {
            var temp = self.vue.board[4*i+j];
            Vue.set(self.vue.board, 4*i+j, self.vue.board[empty]);
            Vue.set(self.vue.board, empty, temp);
        }


        // var temp = self.vue.board[4*i+j];
        // Vue.set(self.vue.board, 4*i+j, self.vue.board[4*i+j+3]);
        // Vue.set(self.vue.board, 4*i+j+3, temp);
    };

    self.permute_array = function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    // Returns the number of inversions in the array
    self.count_inversions = function(array) {
        var num_inversions = 0;
        var current_num;

        for (var i = 0; i < array.length - 1; ++i){
            current_num = array[i];
            for (var j = i + 1; j < array.length; ++j) {
                if (array[j] === 0) { continue; }
                if (array[j] < current_num) { ++num_inversions; }
            }
        }
        return num_inversions;
    }

    // Returns true of zero entry an even number of rows from the buttom row
    // 2nd and 4th from bottom results -> true
    // bottom and 3rd from bottom -> false
    self.zero_on_even = function(array) {
        var zero_index = 0;
        for (; zero_index < array.length; ++zero_index) {
            if (array[zero_index] === 0){
                break;
            }
        }
        if ((zero_index >= 0 && zero_index <= 3) || (zero_index >= 8 && zero_index <= 11)) {
            return true;
        } else {
            return false;
        }
    }

    self.scramble = function() {
        // Read the Wikipedia article.  If you just randomize,
        // the resulting puzzle may not be solvable.

        // Gives me a copy of the board array
        var arr_copy = self.vue.board.slice(0);
        // keep on permuting array until board is solvable
        while(true) {
            self.permute_array(arr_copy);
            console.log(arr_copy);
            var numinv = self.count_inversions(arr_copy);
            var iseven = self.zero_on_even(arr_copy);
            if (((numinv % 2) === 1) && iseven) {
                console.log("Is solvable");
                break;
            }
            else if (((numinv % 2) === 0) && !iseven) {
                console.log("Is solvable");
                break;
            }
            else {
                console.log("Isn't solvable");
                continue;
            }
        }
        self.vue.board = arr_copy;

    };

    self.isRed = function(num) {
        var redArr = [1,3,6,8,9,11,14];
        for (var i = 0; i < redArr.length; ++i) {
            if (redArr[i] === num) {
                return true;
            }
        }
        return false;
    };

    self.isWht = function(num) {
        var whtArr = [2,4,5,7,10,12,13,15];
        for (var i = 0; i < whtArr.length; ++i) {
            if (whtArr[i] === num) {
                return true;
            }
        }
        return false;
    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            board: []
        },
        methods: {
            reset: self.reset,
            shuffle: self.shuffle,
            scramble: self.scramble,
            isRed: self.isRed,
            isWht: self.isWht
        }

    });

    self.reset();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){
    APP = app();
    APP.initialize();
});
