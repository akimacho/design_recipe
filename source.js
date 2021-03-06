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
                            "値", "値"],// テストの値（文字列）
        prev_code       : "",// 変更前のコード
    };
    
    
    /* === テキストエリアの初期化 === */
    
    // CodeMirrorインスタンスの生成
    var myCM = CodeMirror.fromTextArea(
        document.getElementById("editor_ocaml"),
        {
            mode  : "mllike",// OCamlなどのML系言語
            theme : "solarized", // カラーリングテーマ
            lineNumbers : true,// 行番号を表示する
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
    var $p_type         = $container.find('#type_name_params');// 引数の型名
    var $test_num       = $container.find('#num_of_test');// テストの数
    var $test_box       = $container.find('#test_box');// テストの項
    
    /* === 初期化 === */
    createListParams(info);// 作成する関数の引数は1つ
    createNameParams(info);// 作成する関数の引数名は1つ
    createTypeNameParams(info);// 作成する関数の引数の型は1つ
    createTestItem(info);// 作成する関数のテストの数は$test_num.val()個
    setCodeArea(info);
    
    /* - フォームを作成する関数 - */
    /* 引数の項を作成する */
    /* n : パラメータの個数 */
    /* JQueryオブジェクトを利用する */
    /* 戻り値なし */
    function createListParams(obj) {
        $p_item.empty();
        $p_item.append("<td></td>");
        for (var i = 0; i < obj.param_num; i++) {
            $p_item.append("<td>第" + String(i + 1) + "引数</td>")
        }
        $p_item.append("<td>関数が返す結果の型</td>");
    }
    
    /* - 引数の名前のフォームを作成する - */
    /* 戻り値の型はいらない */
    /* n : パラメータのフォームの個数 */
    /* 戻り値なし */
    function createNameParams(obj) {
        $p_name.empty();
        $p_name.append("<td>名前 : </td>")
        for (var i = 0; i < obj.param_num; i++) {
            $p_name.append("<td><input type=\"text\" value="
                            + (function (pn, index) {
                                if (pn[index] == "" || pn[index] == undefined) {
                                    return "引数";
                                }
                                else {
                                    return pn[index];
                                }
                            })(obj.param_name, i) + "></td>");
        }
        $p_name.append("<td></td>");
    }
    
    /* - 引数の型のフォームを作成する - */
    /* n : 型の名前のフォームの個数 */
    /* 戻り値なし */
    function createTypeNameParams(obj) {
        $p_type.empty();
        $p_type.append("<td>その型 : </td>");
        for (var i = 0; i <= obj.param_num; i++) {
            $p_type.append("<td><input type=\"text\" value="
                            + (function (pt, index) {
                                if (pt[index] == "" || pt[index] == undefined) {
                                    return "型";
                                }
                                else {
                                    return pt[index];
                                }
                            })(obj.param_type_name, i) + "></td>");
        }
    }
    
    /* - テストの項目を作る - */
    /* obj : infoオブジェクト */
    /* obj.test_num : テストの個数 */
    /* obj.param_num : 作成する引数の個数*/
    /* 戻り値なし */
    function createTestItem(obj) {
        $test_box.empty();
        for (var i = 0; i <= obj.test_num; i++) {
            $test_box.append("<tr></tr>");
        }
        var $temp = $test_box.find('tr');
        for (var i = 0; i <= obj.test_num; i++) {
            if (i == 0) {
                // 一番上の見出し項目の作成
                for (var j = 0; j <= obj.param_num; j++) {
                    if (j == 0) {
                        $temp.eq(i).append("<td></td>");
                    }
                    else {
                        $temp.eq(i).append("<td>第" + String(j) + "引数の値</td>");
                    }
                }
                // "第N引数の値"の項目の後に追加する項目
                $temp.eq(i).append("<td>期待される結果</td>");
            }
            else {
                for (var j = 0; j <= obj.param_num; j++) {
                    if (j === 0) {
                        $temp.eq(i).append("<td>テスト" + String(i) + "</td>");
                    }
                    else {
                        $temp.eq(i).append("<td><input type=\"text\" value=\"値\"></td>");
                    }
                }
                $temp.eq(i).append("<td><input type=\"text\" value=\"値\"></td>");
            }
        }
    }
    
    /* - 一連の引数の名前を文字列にする - */
    /* pn : 関数の引数の名 */
    /* 戻り値 : 文字列 */
    function createParamNameStr(obj) {
        var temp_str = "";
        for (var i = 0; i < obj.param_num; i++) {
            var t_name = obj.param_name[i];
            if (t_name == "" || t_name == undefined) {
                temp_str += "引数" + " ";
            }
            else {
                temp_str += t_name + " ";
            }
        }
        
        return temp_str;
    }
    
    /* - 一連の引数の型を文字列にする - */
    /* pt : 引数の型の名前 */
    /* 戻り値 : 文字列 */
    function createParamTypeNameStr(obj) {
        var temp_str = "";
        var len = obj.param_type_name.length - 1;
        for (var i = 0; i < len; i++) {
            temp_str += obj.param_type_name[i] + " -> ";
        }
        temp_str += obj.param_type_name[len];
        
        return temp_str;
    }
    
    /* - 再帰関数ならば文字列"rec"を返す - */
    /* obj : infoオブジェクト */
    /* 戻り値 : 文字列 */
    function createRecFunc(obj) {
        if (obj.func_rec) {
            return "rec ";
        }
        else {
            return "";
        }
    }
    
    /* - テストケースの文を作成する - */
    /* obj : infoオブジェクト */
    /* 戻り値 : 文字列 */
    function createTestCaseStr(obj) {
        var temp_str = "";
        var tn = Number(obj.test_num);
        var pn = Number(obj.param_num + 1);// 引数の個数 + 戻り値の個数

        for (var i = 0; i < tn; i++) {
            temp_str += "let test" + (i + 1) + " = " + obj.func_name + " ";
            for (var j = 0; j < pn - 1; j++) {
                var temp_index = pn * i + j;
                if (obj.test_val[temp_index] == ""
                    || obj.test_val[temp_index] == undefined) {
                    temp_str += "値 ";
                }
                else {
                    temp_str += obj.test_val[temp_index] + " ";
                }
            }
            var temp_index = pn * i + (pn - 1);
            if (obj.test_val[temp_index] == ""
                || obj.test_val[temp_index] == undefined) {
                temp_str += " = 値\n";
            }
            else {
                temp_str += " = " + obj.test_val[temp_index] + "\n";
            }
        }
        
        return temp_str;
    }
    
    /* - コードの内容を設定する - */
    /* obj : info */
    function setCodeArea(obj) {
        var code_str = 
            "(* 目的 : " + obj.func_obj + " *)" + "\n" + // 関数の目的
            "(* " + obj.func_name + " : " + // 関数の名前
            createParamTypeNameStr(obj) + " *)" + "\n" + // 関数の型
            "let " + createRecFunc(obj) + obj.func_name + " " + // 関数の定義
            createParamNameStr(obj) + " = " +// 関数の引数
            "\n\n" + // 改行
            "(* テスト *)" + "\n" + 
            createTestCaseStr(obj);// テストケース
        
        myCM.setValue(code_str);
    }
    
    
    /* === イベントハンドラ === */
    
    // 作る関数の名前のフォームが変更されたら，関数の名前を取得する
    $func_name.change(function() {
        info.func_name = $(this).val();
        
        setCodeArea(info);
    });
    
    // 作る関数の目的のフォームが変更されたら，関数の目的を取得する
    $func_obj.change(function() {
        info.func_obj = $(this).val();
        
        setCodeArea(info);
    });
    
    // 作成する引数の数のオプションが変更されたら，
    // 関数の引数のフォームを作成する
    $p_num.change(function() {
        // 作成する関数の引数を取得する
        info.param_num = Number($(this).val());
        
        // 各項を作成する
        createListParams(info);
        createNameParams(info);
        createTypeNameParams(info);
        createTestItem(info);
        
        setCodeArea(info);
    });

    // テストケースのオプションが変更されたら，
    // テストケースの入力フォームを作成する
    $test_num.change(function() {
        info.test_num = Number($(this).val());
        createTestItem(info);
        
        setCodeArea(info);
    });
    
    // 作成する関数の引数の名前が変更されたら，
    // その値を配列info.param_nameに格納する
    $p_name.change(function() {
        var $pn_in = $(this).find('input');
        for (var i = 0; i < info.param_num; i++) {
            info.param_name[i] = $pn_in.eq(i).val();
        }
        
        setCodeArea(info);
    });
    
    // 作成する関数の引数の型が変更されたら，
    // その値を配列info.param_type_nameに格納する
    $p_type.change(function() {
        var $pt_in = $(this).find('input');
        for (var i = 0; i < $pt_in.length; i++) {
            info.param_type_name[i] = $pt_in.eq(i).val();
        }
        
        setCodeArea(info);
    });
    
    // テストケースに入力があったら，
    // 各テストの値を配列に格納する
    $test_box.change(function() {
        var $tb_in = $(this).find('input');
        for (var i = 0; i < $tb_in.length; i++) {
            // info.test_val[]に格納する値は文字列
            var t_val = $tb_in.eq(i).val();
            if (t_val === "" || t_val === undefined) {
                info.test_val[i] = "値";
            }
            else {
                info.test_val[i] = t_val;
            }
        }
        
        setCodeArea(info);
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
        
        setCodeArea(info);
    });
    
    
});

