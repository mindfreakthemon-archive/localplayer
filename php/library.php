<?php

const DS = DIRECTORY_SEPARATOR;
define('ROOT_DIR', dirname(rtrim(__DIR__, '/\\')) . DS);

class Library
{
	public static function main()
	{
		$query = isset($_GET['query']) ? $_GET['query'] : null;
		$array = null;

		try
		{
			$library = new Library($_GET['library']);

			switch($query)
			{
				case 'libraryn':
					$array = $library->getMusic();
				break;
				case 'library':
					$array = $library->getLibrary();
				break;
			}
		}
		catch(Exception $e)
		{
			header('X-Error: ' . $e->getMessage(), true, 404);
		}

		print $array ? json_encode($array) : '{}';
	}


	private $library;
	private $db;

	public function __construct($library)
	{
		$this->library = $library;
		$libpath = ROOT_DIR . 'libraries' . DS . $library . DS;

		$db = new SQLite3($libpath . 'tracks.db', SQLITE3_OPEN_READONLY);
		$db->busyTimeout(500);

		$this->db = $db;
	}

	public function getLibrary()
	{
		$array = array();
		$result = $this->db->prepare('SELECT * FROM tracks')->execute();
		while(($array[] = $result->fetchArray(SQLITE3_ASSOC)) || array_pop($array));

		$library = array();
		$artists = array();
		$albums = array();

		foreach($array as $row)
		{
			if($row['rating'] == 255)
				$row['rating'] = 5;
			elseif($row['rating'] > 195)
				$row['rating'] = 4;
			elseif($row['rating'] > 126)
				$row['rating'] = 3;
			elseif($row['rating'] > 63)
				$row['rating'] = 2;
			elseif($row['rating'] > 0)
				$row['rating'] = 1;

			$artist = $row['artist_hash'];

			if(!isset($artists[$artist]))
			{
				$artists[$artist] = array(
					'title'=>$row['artist'],
					'hash'=>$artist
				);

				$library['artists'][] = &$artists[$artist];
			}

			$album = $row['album_hash'];

			if(!isset($albums[$album]))
			{
				$albums[$album] = array(
					'title'=>$row['album'],
					'hash'=>$row['album_hash'],
					'artist_hash'=>$row['artist_hash'],
					'year'=>$row['year'],
					'genre'=>$row['genre'],
					'cover'=>$row['cover'],
					'count'=>1
				);

				$artists[$artist]['albums'][] = &$albums[$album];
			}
			else
			{
				if(!$albums[$album]['cover'] && $row['cover'])
					$albums[$album]['cover'] = $row['cover'];

				$albums[$album]['count']++;
			}

			$albums[$album]['tracks'][] = array(
				//'playtime'=>$row['playtime'],
				'playtime_string'=>$row['playtime_string'],
				//'bitrate'=>$row['bitrate'],
				'bitrate_string'=>$row['bitrate_string'],

				'artist'=>$row['artist'],
				'album'=>$row['album'],
				'title'=>$row['title'],
				'track_number'=>$row['track_number'],
				//'band'=>$row['band'],
				//'performer'=>$row['performer'],
				//'composer'=>$row['composer'],
				'rating'=>$row['rating'],

				'lyrics'=>$row['lyrics'],
				'cover'=>$row['cover'],
				'cover_mime'=>$row['cover_mime'],

				'hash'=>$row['track_hash'],
				'album_hash'=>$row['album_hash'],
				'artist_hash'=>$row['artist_hash'],
				'audiofile'=>$row['audiofile'],
				'stream'=>$row['stream']
			);
		}

		return $library;
	}
	
	public function getMusic()
	{
		$array = array();
		$result = $this->db->prepare('SELECT * FROM tracks')->execute();
		while(($array[] = $result->fetchArray(SQLITE3_ASSOC)) || array_pop($array));

		$artists = array();
		$albums = array();
		$tracks = array();

		foreach($array as $row)
		{
			if($row['rating'] == 255)
				$row['rating'] = 5;
			elseif($row['rating'] > 195)
				$row['rating'] = 4;
			elseif($row['rating'] > 126)
				$row['rating'] = 3;
			elseif($row['rating'] > 63)
				$row['rating'] = 2;
			elseif($row['rating'] > 0)
				$row['rating'] = 1;

			$artist = $row['artist_hash'];

			if(!isset($artists[$artist]))
			{
				$artists[$artist] = array(
					'title'=>$row['artist'],
					'hash'=>$artist
				);
			}

			$album = $row['album_hash'];

			if(!isset($albums[$album]))
			{
				$albums[$album] = array(
					'title'=>$row['album'],
					'hash'=>$row['album_hash'],
					'artist_hash'=>$row['artist_hash'],
					'year'=>$row['year'],
					'genre'=>$row['genre'],
					'cover'=>$row['cover'],
					'count'=>1
				);
			}
			else
			{
				if(!$albums[$album]['cover'] && $row['cover'])
					$albums[$album]['cover'] = $row['cover'];

				$albums[$album]['count']++;
			}

			$tracks[] = array(
				//'playtime'=>$row['playtime'],
				'playtime_string'=>$row['playtime_string'],
				//'bitrate'=>$row['bitrate'],
				'bitrate_string'=>$row['bitrate_string'],

				'artist'=>$row['artist'],
				'album'=>$row['album'],
				'title'=>$row['title'],
				'track_number'=>$row['track_number'],
				//'band'=>$row['band'],
				//'performer'=>$row['performer'],
				//'composer'=>$row['composer'],
				'rating'=>$row['rating'],

				'lyrics'=>$row['lyrics'],
				'cover'=>$row['cover'],
				'cover_mime'=>$row['cover_mime'],

				'hash'=>$row['track_hash'],
				'album_hash'=>$row['album_hash'],
				'artist_hash'=>$row['artist_hash'],
				'audiofile'=>$row['audiofile'],
				'stream'=>$row['stream']
			);
		}

		return array(
			'artists'=>array_values($artists),
			'albums'=>array_values($albums),
			'tracks'=>$tracks
		);
	}
}

Library::main();