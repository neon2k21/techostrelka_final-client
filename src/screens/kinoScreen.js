import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, Image, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { kinoIp_adress } from "../../config";

export default function KinoScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPageBlock, setCurrentPageBlock] = useState(1); // Текущий блок страниц
  const pagesPerBlock = 10; // Количество страниц в блоке

// Функция для получения данных о фильмах
const fetchMovies = async (blockNumber) => {
  try {
    setLoading(true);
    let allMovies = [];

    // Загружаем данные с 5 страниц (или меньше)
    for (let page = (blockNumber - 1) * pagesPerBlock + 1; page <= blockNumber * pagesPerBlock; page++) {
      const response = await fetch(
        `${kinoIp_adress}/movies?page=${page}&limit=10` // URL вашего сервера
      );
      const data = await response.json();

      // Если страница пустая, выходим из цикла
      if (!data.docs || data.docs.length === 0) break;

      // Добавляем только фильмы с постером
      const filteredMovies = data.docs.filter((movie) => movie.poster?.url);
      allMovies = [...allMovies, ...filteredMovies];

      // Если страниц меньше, чем ожидалось, выходим из цикла
      if (data.pages < page) break;
    }

    setMovies(allMovies);
    setLoading(false);
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    setLoading(false);
  }
};

  useEffect(() => {
    fetchMovies(currentPageBlock);
  }, [currentPageBlock]);

  // Открытие фильма на Кинопоиске
  const searchOnKinopoisk = (movie) => {
    const query = encodeURIComponent(`${movie.name || movie.alternativeName} ${movie.year}`);
    const kinopoiskUrl = `https://www.kinopoisk.ru/index.php?kp_query=${query}`;
    Linking.openURL(kinopoiskUrl);
  };

  // Открытие фильма на Яндекс Видео
  const searchOnYandexVideo = (movie) => {
    const query = encodeURIComponent(`${movie.name || movie.alternativeName} ${movie.year}`);
    const yandexUrl = `https://yandex.ru/video/search?text=${query}`;
    Linking.openURL(yandexUrl);
  };

  // Открытие фильма в Google
  const searchOnGoogle = (movie) => {
    const query = encodeURIComponent(`${movie.name || movie.alternativeName} ${movie.year}`);
    const googleUrl = `https://www.google.com/search?q=${query}`;
    Linking.openURL(googleUrl);
  };

  // Открытие фильма на ivi
  const watchFullMovieOnIvi = (movie) => {
    const query = encodeURIComponent(`${movie.name || movie.alternativeName} ${movie.year}`);
    const iviUrl = `https://www.ivi.ru/search/?q=${query}`;
    Linking.openURL(iviUrl);
  };

  // Компонент для отображения карточки фильма
  const MovieCard = ({ movie, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Отображение постера */}
      <Image source={{ uri: movie.poster.url }} style={styles.poster} />
      {/* Информация о фильме */}
      <Text style={styles.title}>{movie.name || movie.alternativeName}</Text>
      <Text style={styles.year}>Год: {movie.year}</Text>
      <Text style={styles.rating}>Рейтинг: {movie.rating?.kp || 'N/A'}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0052A8" />
      </View>
    );
  }

  if (selectedMovie) {
    return (
      <ScrollView style={styles.detailsContainer}>
        {/* Отображение постера */}
        <Image source={{ uri: selectedMovie.poster.url }} style={styles.detailsPoster} />
        <Text style={styles.detailsTitle}>{selectedMovie.name || selectedMovie.alternativeName}</Text>
        <Text style={styles.detailsYear}>Год: {selectedMovie.year}</Text>
        <Text style={styles.detailsRating}>Рейтинг: {selectedMovie.rating?.kp || 'N/A'}</Text>
        <Text style={styles.detailsDescription}>{selectedMovie.description || 'Описание недоступно'}</Text>
        {/* Кнопки */}
        <TouchableOpacity style={[styles.watchButton, styles.kinopoiskButton]} onPress={() => searchOnKinopoisk(selectedMovie)}>
          <Text style={styles.watchButtonText}>Поиск на Кинопоиске</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.watchButton, styles.yandexButton]} onPress={() => searchOnYandexVideo(selectedMovie)}>
          <Text style={styles.watchButtonText}>Поиск на Яндексе</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.watchButton, styles.googleButton]} onPress={() => searchOnGoogle(selectedMovie)}>
          <Text style={styles.watchButtonText}>Поиск в Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.watchButton, styles.fullMovieButton]} onPress={() => watchFullMovieOnIvi(selectedMovie)}>
          <Text style={styles.watchButtonText}>Смотреть на ivi</Text>
        </TouchableOpacity>
        {/* Кнопка "Назад" */}
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedMovie(null)}>
          <Text style={styles.backButtonText}>Назад к списку</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => setSelectedMovie(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Фильмы не найдены</Text>}
      />
      {/* Кнопки переключения страниц */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, currentPageBlock === 1 && styles.disabledButton]}
          disabled={currentPageBlock === 1}
          onPress={() => setCurrentPageBlock(currentPageBlock - 1)}
        >
          <Text style={styles.paginationButtonText}>Предыдущие</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={() => setCurrentPageBlock(currentPageBlock + 1)}
        >
          <Text style={styles.paginationButtonText}>Следующие</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: wp(4), // Адаптивные отступы
  },
  card: {
    backgroundColor: '#F5F5F5',
    padding: wp(3),
    marginTop: hp(3),
    marginRight: wp(2),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5
  },
  poster: {
    width: wp(90), // Ширина 90% экрана
    height: hp(30), // Высота 30% экрана
    resizeMode: 'contain',
    borderRadius: wp(2),
    marginBottom: hp(1),
  },
  title: {
    fontSize: wp(4.5), // Размер шрифта адаптивный
    fontWeight: 'bold',
    color: '#333',
  },
  year: {
    fontSize: wp(3.5),
    color: '#666',
  },
  rating: {
    fontSize: wp(3.5),
    color: '#0052A8', // Цвет рейтинга как у Ростелекома
  },
  detailsContainer: {
    flex: 1,
    padding: wp(5),
    backgroundColor: '#FFFFFF',
  },
  detailsPoster: {
    width: wp(90),
    height: hp(40),
    resizeMode: 'contain',
    borderRadius: wp(2),
    marginBottom: hp(2),
  },
  detailsTitle: {
    fontSize: wp(6),
    fontWeight: 'bold',
    marginBottom: hp(1),
    color: '#333',
  },
  detailsYear: {
    fontSize: wp(4),
    color: '#666',
    marginBottom: hp(1),
  },
  detailsRating: {
    fontSize: wp(4),
    color: '#0052A8',
    marginBottom: hp(2),
  },
  detailsDescription: {
    fontSize: wp(3.5),
    color: '#333',
    marginBottom: hp(3),
  },
  backButton: {
    backgroundColor: '#0052A8',
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: wp(7),
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(90),
    marginBottom: hp(3),
  },
  paginationButton: {
    backgroundColor: '#7700FF',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
    alignItems: 'center',
    flex: 1,
    marginHorizontal: wp(2),
  },
  disabledButton: {
    backgroundColor: '#7700FF',
  },
  paginationButtonText: {
    color: '#FFFFFF',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  watchButton: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(8),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  kinopoiskButton: {
    backgroundColor: '#FFC107', // Жёлтый для Кинопоиска
  },
  yandexButton: {
    backgroundColor: '#FF5722', // Оранжевый для Яндекса
  },
  googleButton: {
    backgroundColor: '#4285F4', // Синий для Google
  },
  fullMovieButton: {
    backgroundColor: '#CC0605', // Красный для ivi
  },
  watchButtonText: {
    color: '#FFFFFF',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: hp(5),
    fontSize: wp(5),
    color: '#888',
  },
});