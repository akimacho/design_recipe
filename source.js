/*
 * デザインレシピにより，関数プロトタイプを作成する
 * filename : source.js
 */


$(function() {
    /* === 作成するOCamlのコードに関するデータ === */
    
    var info = {
        func_name       : "関数名",// 関数名
        func_obj        : "目的",// 目的
        func_rec        : false,// 再帰関数かどうかのチェックボックスの状態
        param_num       : 1,// 引数の数
        param_name      : ["引数"],// 関数の引数の名前
        param_type_name : ["型", "型"],// 関数の引数の型名
        test_num        : 3,// テスト数
        test_val        : ["値", "値",
                            "値", "値",
                            "値", "値"],// テストの値
    };
    
    
    /* === テキストエリアの初期化 === */
    
    // CodeMirrorインスタンスの生成
    var myCM = CodeMirror.fromTextArea(
        document.getElementById("editor_ocaml"),
        {
            mode  : "mllike", // OCamlなどのML系言語
            lineNumbers: true,// 行番号を表示する
        }
    );
    
    
    /* === 要素の取得 === */
    
    var $container      = $('.content');// コンテンツ
    var $func_name      = $container.find('#name_of_func');// 関数名
    var $func_obj       = $container.find('#obj_of_func');// 関数の目的
    var $func_rec       = $container.find('#rec');
    var $p_num          = $container.find('#num_of_params');// 引数の数
    var $p_item         = $container.find('#list_of_params');// 引数の項目
    var $p_name         = $container.find('#name_of_params');// 引数の名前
    var $p_name_in      = $container.find('#name_of_params input');
    var $p_type         = $container.find('#type_name_params');// 引数の型名
    var $test_num       = $container.find('#num_of_test');// テストの数
    var $test_box       = $container.find('#test_box');// テストの項
    var $editor_ocaml   = $container.find('#editor_ocaml');// コードエリア
    var $dump           = $container.find('#dump');
    
    /* - フォームを作成する関数 - */
    /* 引数の項を作成する */
    /* n : パラメータの個数 */
    function createListParams(n) {
        $p_item.append("<td></td>");
        for (var i = 0; i < n; i++) {
            $p_item.append("<td>第" + (i + 1) + "引数</td>")
        }
        $p_item.append("<td>関数が返す結果の型</td>");
    }
    
    /* - 引数の名前のフォームを作成する - */
    /* n : パラメータのフォームの個数 */
    /* 戻り値の型はいらない */
    function createNameParams(n) {
        $p_name.append("<td>名前</td>")
        for (var i = 0; i < n; i++) {
            $p_name.append('<td><input type="text" value="引数"></td>');
        }
        $p_name.append("<td></td>");
    }
    
    /* - 引数の型のフォームを作成する - */
    /* n : 型の名前のフォームの個数 */
    function createTypeNameParams(n) {
        $p_type.append("<td>その型 : </td>");
        for (var i = 0; i <= n; i++) {
            // class名 : p_type_in
            $p_type.append("<td><input type=\"text\" class=\"p_type_in\" value=\"型\"></td>");
        }
    }
    
    /* - テストの項目を作る - */
    /* m : テストの個数 */
    /* n : 作成する引数の個数*/
    function createTestItem(m, n) {
        for (var i = 0; i <= m; i++) {
            $test_box.append("<tr></tr>");
        }
        var $temp = $('#test_box tr');
        
        for (var i = 0; i <= m; i++) {
            if (i === 0) {
                for (var j = 0; j <= n; j++) {
                    if (j === 0) {
                        $temp.eq(i).append("<td></td>");
                    }
                    else {
                        $temp.eq(i).append("<td>第" + j + "引数の値</td>");
                    }
                }
                $temp.eq(i).append("<td>期待される結果</td>");
            }
            else {
                for (var j = 0; j <= n; j++) {
                    if (j === 0) {
                        $temp.eq(i).append("<td>テスト" + (i) + "</td>");
                    }
                    else {
                        $temp.eq(i).append("<td><input type=\"text\" value=\"値\"></td>");
                    }
                }
                $temp.eq(i).append('<td><input type="text" value=\"値\"></td>');
            }
        }
    }
    
    /* - 一連の引数の名前を文字列にする - */
    /* pn : 関数の引数の名 */
    function createParamNameStr(pn) {
        var temp_str = "";
        for (var i = 0; i < pn.length; i++) {
            temp_str += pn[i];
        }
        return temp_str;
    }
    
    /* - 一連の引数の型を文字列にする - */
    /* pt : 引数の型の名前 */
    function createParamTypeNameStr(pt) {
        var temp_str = "";
        for (var i = 0; i < pt.length - 1; i++) {
            temp_str += pt[i] + " -> ";
        }
        temp_str += pt[pt.length - 1];
        return temp_str;
    }
    
    /* - 再帰関数ならば文字列"rec"を返す - */
    /* obj : infoオブジェクト */
    function createRecFunc(obj) {
        if (obj.func_rec) {
            return "rec ";
        }
        else {
            return "";
        }
    }
    
    /* - テストケースの文を作成する - */
    /* obj : info */
    function createTestCaseStr(obj) {
        var temp_str = "";
        var tn = Number(obj.test_num);
        var pn = Number(obj.param_num + 1);
        var len = obj.test_val.length; // テストのフォーム数

        for (var i = 0; i < tn * pn; i++) {
            if (obj.test_val[i] === undefined) {
                info.test_val[i] = "値";
            }
        }

        for (var i = 0; i < tn; i++) {
            temp_str += "let test" + (i + 1) + " = " + obj.func_name + " ";
            for (var j = 0; j < pn - 1; j++) {
                temp_str += obj.test_val[pn * i + j] + " ";
            }
            temp_str += " = " + obj.test_val[pn * i + (pn - 1)] + "\n";
        }
        return temp_str;
    }
    
    /* - コードの内容を設定する - */
    /* obj : info */
    function setCodeArea(obj) {
        var temp = 
            "(* 目的 : " + obj.func_obj + " *)" + "\n" + // 関数の目的
            "(* " + obj.func_name + " : " + // 関数の名前
            createParamTypeNameStr(obj.param_type_name) + " *)" + "\n" + // 関数の型
            "let " + createRecFunc(obj) + obj.func_name + " " + // 関数の定義
            createParamNameStr(obj.param_name) + " = \n" +// 関数の引数
            "\n\n" + // 空白&改行
            "(* テスト *)" + "\n" + 
            createTestCaseStr(obj) + "\n";// テストケース
        myCM.setValue(temp);
    }
    
    
    /* === 初期化 === */
    createListParams(1);// 作成する関数の引数は1つ
    createNameParams(1);// 作成する関数の引数名は1つ
    createTypeNameParams(1);// 作成する関数の引数の型は1つ
    createTestItem($test_num.val(), $p_num.val());// 作成する関数のテストの数は$test_num.val()個
    
    setCodeArea(info);    
    
    
    /* === イベントハンドラ === */
    
    // 作る関数の名前のフォームが変更されたら，関数の名前を取得する
    $func_name.change(function() {
        info.func_name = $(this).val();
    });
    
    // 作る関数の目的のフォームが変更されたら，関数の目的を取得する
    $func_obj.change(function() {
        info.func_obj = $(this).val();
    });
    
    // 作成する引数の数のオプションが変更されたら，
    // 関数の引数のフォームを作成する
    $p_num.change(function() {
        // 各DOMの子要素を一度空にする
        $p_item.empty();
        $p_name.empty();
        $p_type.empty();
        $test_box.empty();
        // 各項を作成する
        createListParams($(this).val());
        createNameParams($(this).val());
        createTypeNameParams($(this).val());
        createTestItem($test_num.val(), $p_num.val());
        // 作成する関数の引数を取得する
        info.param_num = Number($(this).val());
    });

    // テストケースのオプションが変更されたら，
    // テストケースの入力フォームを作成する
    $test_num.change(function() {
        $test_box.empty();
        info.test_num = Number($(this).val());
        createTestItem($test_num.val(), $p_num.val());
    });
    
    // 作成する関数の引数の名前が変更されたら，
    // その値を配列info.param_nameに格納する
    $p_name.change(function() {
        var $pn_in = $(this).find('input');
        for (var i = 0; i < $pn_in.length; i++) {
            info.param_name[i] = $pn_in.eq(i).val();
        }
    });
    
    // 作成する関数の引数の型が変更されたら，
    // その値を配列info.param_type_nameに格納する
    $p_type.change(function() {
        var $pt_in = $(this).find('input');
        for (var i = 0; i < $pt_in.length; i++) {
            info.param_type_name[i] = $pt_in.eq(i).val();
        }
    });
    
    // テストケースに入力があったら，
    // 各テストの値を配列に格納する
    $test_box.change(function() {
        var $tb_in = $(this).find('input');
        for (var i = 0; i < $tb_in.length; i++) {
            if ($tb_in.eq(i).val() === undefined) {
                info.test_val[i] = "値";
            }
            else {
                info.test_val[i] = $tb_in.eq(i).val();
            }
        }
    });
    
    // 再帰関数かどうかのチェックボックスがクリックされたら，
    // info.func_rec をtrueにする
    $func_rec.click(function() {
        if ($(this).prop('checked')) {
            info.func_rec = true;
        }
        else {
            info.func_rec = false;
        }
    });
    
    // ecのDOMに変更があったら，
    $('.ec').on('change', function() {
        setCodeArea(info);
    });
    
    $('.ec').on('click', function() {
        setCodeArea(info);
    });
    
});

