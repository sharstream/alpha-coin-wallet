$( document ).ready(function() {
	$('.nav_button').click(function() {
		if ($('.ccc-widget').find('canvas').length > 0) {
			if ($('.ccc-widget').find('canvas').css("width") !== "100%") {
				var graph_smoother = setInterval(function() {
					$('a:contains("Followers"), img[src*="cryptocompare.com"]').remove();
					$('.ccc-widget').find('canvas').css({'width':'100%'});
					$('.ccc-widget *').css({'font-family':`'Tajawal', sans-serif`});

					if ($('.ccc-widget').find('canvas').css("width") === "100%") {
						clearInterval(graph_smoother);
					}
				}, 100);
			}
		}
		
		$('.wallet_keys_container').css({'display':'none', 'opacity':'0'});
		$('.transaction_history_container').css({'display':'none', 'opacity':'0'});
		$('.crypto_charts_container').css({'display':'none', 'opacity':'0'});
		$('.trade_bitcoin_container').css({'display':'none', 'opacity':'0'});
		
		if ($(this).hasClass('nav_wallet_keys')) {
			$('.wallet_keys_container').css({'display':'block', 'opacity':'1'});
		} else if ($(this).hasClass('nav_transaction_history')) {
			$('.transaction_history_container').css({'display':'block', 'opacity':'1'});
		} else if ($(this).hasClass('nav_crypto_charts')) {
			$('.crypto_charts_container').css({'display':'block', 'opacity':'1'});
		} else if ($(this).hasClass('nav_trade_bitcoin')) {
			$('.trade_bitcoin_container').css({'display':'block', 'opacity':'1'});
		} 
		
		$('.nav_button').each(function() {
			$(this).css({'background':'white','border-color':'#d9aa9a','color':'lightgrey'});
		});
		
		$(this).css({'background':'#998999','border-color':'#998999','color':'white'});
	});

	$('.display_login_modal').click(function() {
		$('.username_input').attr({'placeholder':'Existing User '});
		$('.password_input').attr({'placeholder':'Password '});
		$('.confirm_password_input').css({'display':'none'});
		$('.type_of_user_button').html('New User');
		$('.login_modal').eq(0).css({'opacity':'1','z-index':'2'});
	});
	
	$('.new_wallet_key').click(function() {
		$('.new_wallet_key_modal').css({'opacity':'1','z-index':'2'});
	});

	$('.close_modal').click(function() {
		$('.login_modal').css({'opacity':0,'z-index':'-1'});
		$('.new_wallet_key_modal').css({'opacity':0,'z-index':'-1'});
	});

	$("li").mouseup(function(e) {
		e.preventDefault();
	});
	
	$('li').click(function() {
		var key_to_copy = document.querySelector($(this).find('input').val());
		
		$(this).find('input').select();
		document.execCommand("copy");
		
		$('.key_copied').text($(this).find('.wallet_name').html().trim() + ' key copied');
		
		setTimeout(function() {
			$('.key_copied').text('click to copy');
		}, 2000);
	});
	
	$('.type_of_user_button').click(function() {
		if ($(this).html() === "New User") {
			$('.username_input').attr({'placeholder':'New User'});
			$('.password_input').attr({'placeholder':'New Password'});
			$('.confirm_password_input').css({'display':'block'});

			$(this).html('Existing User');
		} else if ($(this).html() === "Existing User") {
			$('.username_input').attr({'placeholder':'Existing User '});
			$('.password_input').attr({'placeholder':'Password '});
			$('.confirm_password_input').css({'display':'none'});
			
			$(this).html('New User');
		}
	});
	
	$('.add_wallet_key_button').click(function() {
		if ($('.wallet_name_input').val().length > 0) {
			var new_wallet_name = $('.wallet_name_input').val();
			var new_wallet_key = $('.wallet_key_input').val();
			
			var new_wallet_key_entry = '<li class="wallet_key_entry"><p class="wallet_name">' + new_wallet_name + '</p><p class="wallet_key">' + new_wallet_key + '</p><input type="text" value="' + new_wallet_key + '"></li>';
			
			$('.list_of_wallet_keys').append(new_wallet_key_entry);
		}
	});
});